from flask import Flask, request, jsonify, render_template, Blueprint
from werkzeug.utils import secure_filename
import filetype
import os
from datetime import datetime, timedelta, timezone
import re
from database.bd import get_comunas_por_region, get_all_regiones, create_aviso, create_foto,get_all_avisos, create_contactar_por, get_aviso_by_id, get_ultimos_5_avisos

bp = Blueprint('api', __name__)

@bp.route('/api/regiones', methods=['GET'])
def api_get_regiones():
    try:
        regiones = get_all_regiones()
        result = [{'id': r.id, 'nombre': r.nombre} for r in regiones]
        return jsonify(result)
    except Exception as e:
        print("Error en /api/regiones:", e)  # Esto imprime el error real
        return jsonify({'error': f'Error al obtener regiones: {e}'}), 500

@bp.route('/api/comunas/<int:region_id>', methods=['GET'])
def api_get_comunas(region_id):
    try:
        comunas = get_comunas_por_region(region_id)
        result = [{'id': c.id, 'nombre': c.nombre} for c in comunas]
        return jsonify(result)
    except Exception as e:
        print("Error al obtener comunas:", e)
        return jsonify({'error': 'Error al obtener comunas'}), 500


app = Flask(__name__)

app.register_blueprint(bp)

# Máximo 5MB por foto
MAX_FILE_SIZE = 5 * 1024 * 1024  
# Máximo fotos permitidas
MAX_FILES = 10
# Redes sociales permitidas 
REDES_VALIDAS = {'whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'}
# Tipos de animales permitidos
TIPOS_VALIDOS = {'gato', 'perro'}
# Unidades de edad permitidas
UNIDADES_EDAD_VALIDAS = {'a', 'm'}

def validar_email(email):
    if not email or len(email) < 3 or len(email) > 100:
        return False
    # Regex básico para email (puedes usar uno más estricto si quieres)
    regex = r'^[^@]+@[^@]+\.[^@]+$'
    return re.match(regex, email) is not None

def validar_celular(celular):
    # Debe cumplir +ddd.dddddddd
    return celular and re.match(r'^\+\d{3}\.\d{8}$', celular)

def validar_nombre(nombre):
    return nombre and 4 <= len(nombre) <= 200

def validar_numero(valor, minv, maxv):
    try:
        num = int(valor)
        return minv <= num <= maxv
    except:
        return False

def validar_region_comuna(region_id, comuna_id):
    return bool(region_id) and bool(comuna_id)


def validar_redes_sociales(redes):
    if not redes or len(redes) > 5:
        return False
    for r in redes:
        tipo = r.get("tipo")
        dato = r.get("dato", "").strip()
        if tipo not in REDES_VALIDAS or not dato:
            return False
    return True

def validar_tipo(tipo):
    return tipo in TIPOS_VALIDOS

def validar_unidad_edad(unidad):

    return unidad in UNIDADES_EDAD_VALIDAS

def validar_fecha_entrega(fecha_str):
    try:
        # Parsear el formato del input datetime-local
        fecha = datetime.strptime(fecha_str, "%Y-%m-%dT%H:%M")
        fecha = fecha.replace(tzinfo=timezone.utc)
    except ValueError:
        return False
    ahora_mas_3h = datetime.now(timezone.utc) + timedelta(hours=3)
    return fecha >= ahora_mas_3h

def validar_archivo(file):
    # Validar tamaño
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return False
    # Validar tipo con filetype
    kind = filetype.guess(file)
    file.seek(0)
    if kind is None or not kind.mime.startswith("image/"):
        return False
    return True


@app.route('/form_add', methods=['GET', 'POST'])
def form_add():

    print("FormData recibido: ", request.form)

    if request.method == 'GET':
        # Aquí muestras el formulario
        return render_template('form/form_add.html')  # O la plantilla que tenga el form
    data = request.form
    files = request.files.getlist('fotos[]')

    errores = []

    # Validar email
    email = data.get('email', '').strip()
    if not validar_email(email):
        errores.append({'campo': 'email', 'mensaje': 'Email inválido o vacío'})

    # Validar celular (puede ser vacío si es opcional)
    celular = data.get('celular', '').strip()
    if celular and not validar_celular(celular):
        errores.append({'campo': 'celular', 'mensaje': 'Formato celular inválido (+569.12345678)'})

    # Validar nombre
    nombre = data.get('nombre', '').strip()
    if not validar_nombre(nombre):
        errores.append({'campo': 'nombre', 'mensaje': 'Nombre debe tener entre 4 y 200 caracteres'})

    # Validar cantidad
    cantidad = data.get('cantidad', '').strip()
    if not validar_numero(cantidad, 1, 1000):  # Ajusta rango según tu necesidad
        errores.append({'campo': 'cantidad', 'mensaje': 'Cantidad debe ser número entre 1 y 1000'})

    # Validar edad
    edad = data.get('edad', '').strip()
    if not validar_numero(edad, 1, 20):
        errores.append({'campo': 'edad', 'mensaje': 'Edad debe ser número entre 1 y 20'})

    # Validar región y comuna
    region = data.get('region', '').strip()
    comuna = data.get('comuna', '').strip()
    if not validar_region_comuna(region, comuna):
        errores.append({'campo': 'region_comuna', 'mensaje': 'Región o comuna inválida'})

    # Validar radio buttons 
    especie = data.get('tipo')  # 'perro' o 'gato'
    if not validar_tipo(especie):
        errores.append({'campo': 'tipo', 'mensaje': 'Seleccione una opción para Tipo de animal'})

    unidad_edad = data.get('unidad_edad')  # 'años' o 'meses'
    
    if not validar_unidad_edad(unidad_edad):
        errores.append({'campo': 'unidad_edad', 'mensaje': 'Seleccione una opción para unidad de edad'})

    # Validar redes sociales 
    tipos_contacto = data.getlist('tipo_contacto[]')  # Lista de tipos de redes sociales
    identificadores = data.getlist('identificador[]')  # Lista de identificadores (usuarios o enlaces)

    if tipos_contacto and identificadores:
        # Validar que las listas de redes y los identificadores tengan el mismo tamaño
        if len(tipos_contacto) != len(identificadores):
            errores.append({'campo': 'redes', 'mensaje': 'El número de redes sociales y los identificadores no coinciden.'})

        # Validar redes sociales
        for tipo, identificador in zip(tipos_contacto, identificadores):
            if not tipo or not identificador:
                errores.append({'campo': 'redes', 'mensaje': f'El contacto para {tipo} es inválido.'})
    else:
        pass # Redes sociales son opcionales


    # Validar fecha entrega
    fecha_entrega = data.get('fecha_entrega')
    if not fecha_entrega or not validar_fecha_entrega(fecha_entrega):
        errores.append({'campo': 'fecha-entrega', 'mensaje': 'Fecha de entrega inválida o muy temprana'})

    # Validar archivos (fotos)
    if not files or len(files) == 0:
        errores.append({'campo': 'fotos', 'mensaje': 'Debe subir al menos una foto'})
    elif len(files) > MAX_FILES:
        errores.append({'campo': 'fotos', 'mensaje': f'Solo se permiten máximo {MAX_FILES} fotos'})
    else:
        for f in files:
            if not validar_archivo(f):
                errores.append({'campo': 'fotos', 'mensaje': f'Archivo {f.filename} no es imagen válida o pesa más de 5MB'})
                break

    if errores:
        mensaje_resumido = errores[0]['mensaje'] if errores else 'Error desconocido'
        return jsonify({'success': False, 'error': mensaje_resumido, 'errores': errores}), 400

    # Si todo está OK, procesa y guarda 
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Ruta absoluta del directorio donde está el archivo actual

    carpeta_guardar = os.path.join(BASE_DIR, 'static', 'uploads')
    os.makedirs(carpeta_guardar, exist_ok=True)
    nombres_guardados = []

    for f in files:
        filename = secure_filename(f.filename)
        filepath = os.path.join(carpeta_guardar, filename)
        f.save(filepath)
        nombres_guardados.append(filename)

    # Parsear fecha entrega a datetime
    try:
        fecha_entrega_dt = datetime.fromisoformat(fecha_entrega)
    except ValueError:
        return jsonify({'success': False, 'error': 'Formato de fecha inválido'}), 400


    comuna_id = int(comuna)
    # Crear aviso en BD
    try:
        nuevo_aviso = create_aviso(
            comuna_id=comuna_id,
            sector=data.get('sector', ''),
            nombre=nombre,
            email=email,
            celular=celular,
            tipo=especie,
            cantidad=int(cantidad),
            edad=int(edad),
            unidad_medida=unidad_edad,
            fecha_entrega=fecha_entrega_dt,
            descripcion=data.get('descripcion', '')
        )
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error al guardar aviso: {str(e)}'}), 500

    # **Guardar redes sociales** (usando la función `create_contactar_por`):
    try:
        print("Tipos contacto:", tipos_contacto)
        print("Identificadores:", identificadores)  
        for tipo, identificador in zip(tipos_contacto, identificadores):
            create_contactar_por(tipo, identificador, nuevo_aviso.id)
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error al guardar redes sociales: {str(e)}'}), 500


    # Guardar fotos vinculadas al aviso
    try:
        for filename in nombres_guardados:
            ruta = os.path.join("/uploads", filename)
            create_foto(ruta_archivo=ruta, nombre_archivo=filename, actividad_id=nuevo_aviso.id)
    except Exception as e:
        return jsonify({'success': False, 'error': f'Error al guardar fotos: {str(e)}'}), 500

    
    return jsonify({
        'success': True,
        'mensaje': 'Formulario recibido y guardado correctamente',
        'archivos': nombres_guardados
    })

@app.route('/') 
def index(): 
    u_avisos=get_ultimos_5_avisos()
    return render_template('main/index.html', u_avisos=u_avisos) 

@app.route('/aviso/<int:aviso_id>')
def ver_aviso(aviso_id):
    aviso = get_aviso_by_id(aviso_id)
    return render_template('posts/detalles.html', aviso=aviso)

@app.route('/see_post') 
def see_post(): 
    avisos = get_all_avisos()
    return render_template('posts/see_post.html', avisos=avisos) 

@app.route('/statistics') 
def statistics(): 
    return render_template('statistics/statistics.html')


if __name__ == '__main__':
    app.run(debug=True)
