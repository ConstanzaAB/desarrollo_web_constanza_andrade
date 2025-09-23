from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import filetype
import os
from datetime import datetime, timedelta
import re

app = Flask(__name__)

# Máximo 5MB por foto
MAX_FILE_SIZE = 5 * 1024 * 1024  
# Máximo fotos permitidas
MAX_FILES = 10
# Redes sociales permitidas (ejemplo)
REDES_VALIDAS = {"facebook", "twitter", "instagram", "linkedin", "tiktok"}

# Región y comunas según tu estructura (debes adaptar a tu data real)
regionKeyToName = {
    "arica": "Región Arica y Parinacota",
    "tarapaca": "Región de Tarapacá",
    # ... Completa con todas las regiones
}

region_comuna = {
    "Región Arica y Parinacota": ["Comuna1", "Comuna2"],  # Ejemplo
    # ... Completa con las comunas reales
}

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

def validar_region_comuna(region_key, comuna_val):
    region_nombre = regionKeyToName.get(region_key)
    if not region_nombre:
        return False
    comunas_validas = region_comuna.get(region_nombre, [])
    return comuna_val in [c.lower() for c in comunas_validas]

def validar_redes_sociales(redes):
    if not redes or len(redes) > 5:
        return False
    for r in redes:
        tipo = r.get("tipo")
        dato = r.get("dato", "").strip()
        if tipo not in REDES_VALIDAS or not dato:
            return False
    return True

def validar_fecha_entrega(fecha_str):
    try:
        fecha = datetime.fromisoformat(fecha_str)
    except:
        return False
    ahora_mas_3h = datetime.now() + timedelta(hours=3)
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
    if not validar_numero(edad, 18, 120):
        errores.append({'campo': 'edad', 'mensaje': 'Edad debe ser número entre 18 y 120'})

    # Validar región y comuna
    region = data.get('region', '').strip()
    comuna = data.get('comuna', '').strip()
    if not validar_region_comuna(region, comuna):
        errores.append({'campo': 'region_comuna', 'mensaje': 'Región o comuna inválida'})

    # Validar radio buttons (ejemplo: 'sexo' debe estar seleccionado)
    sexo = data.get('sexo')
    if not sexo:
        errores.append({'campo': 'sexo', 'mensaje': 'Seleccione una opción para sexo'})

    # Validar redes sociales (recibimos JSON o formulario con campos específicos)
    # Aquí suponemos que te llegan como JSON en campo 'redes' o como parámetros específicos
    redes = request.form.get('redes')
    if redes:
        import json
        try:
            redes_list = json.loads(redes)
            if not validar_redes_sociales(redes_list):
                errores.append({'campo': 'redes', 'mensaje': 'Redes sociales inválidas o demasiadas'})
        except:
            errores.append({'campo': 'redes', 'mensaje': 'Error al leer redes sociales'})
    else:
        # Si las redes son individuales, puedes validarlas aquí según tu estructura
        pass

    # Validar fecha entrega
    fecha_entrega = data.get('fecha-entrega')
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
        return jsonify({'success': False, 'errores': errores}), 400

    # Si todo está OK, procesa y guarda (ejemplo guardar archivos)
    carpeta_guardar = './uploads'
    os.makedirs(carpeta_guardar, exist_ok=True)
    nombres_guardados = []

    for f in files:
        filename = secure_filename(f.filename)
        filepath = os.path.join(carpeta_guardar, filename)
        f.save(filepath)
        nombres_guardados.append(filename)

    # Guardar en base de datos o lo que necesites

    return jsonify({'success': True, 'mensaje': 'Formulario recibido y validado correctamente', 'archivos': nombres_guardados})

@app.route('/') 
def index(): 
    return render_template('main/index.html') 

@app.route('/see_post') 
def see_post(): 
    return render_template('posts/see_post.html') 

@app.route('/statistics') 
def statistics(): 
    return render_template('statistics/statistics.html')


if __name__ == '__main__':
    app.run(debug=True)
