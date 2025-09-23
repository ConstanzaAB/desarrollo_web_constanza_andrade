from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_HOST = "localhost"
DB_PASSWORD = "programacionweb"
DB_PORT = 3306
DB_CHARSET = "utf8"

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Models ---


class Region(Base):
    __tablename__ = 'region'

    id = Base.Column(Base.Integer, primary_key=True, autoincrement=True)
    nombre = Base.Column(Base.String(200), nullable=False)

    # Una región tiene muchas comunas
    comunas = Base.relationship('Comuna', backref='region', lazy=True)


class Comuna(Base):
    __tablename__ = 'comuna'

    id = Base.Column(Base.Integer, primary_key=True, autoincrement=True)
    nombre = Base.Column(Base.String(200), nullable=False)

    region_id = Base.Column(Base.Integer, Base.ForeignKey('region.id'), nullable=False)

    # Una comuna puede tener muchos avisos
    actividades = Base.relationship('Actividad', backref='comuna', lazy=True)

class Aviso(Base):
    __tablename__ = 'aviso_adopcion'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha_ingreso = Base.Column(Base.DateTime, nullable=False, default=datetime.utcnow)

    comuna_id = Base.Column(Base.Integer, nullable=False)
    sector = Base.Column(Base.String(100), nullable=True)  

    nombre = Base.Column(Base.String(200), nullable=False)  
    email = Base.Column(Base.String(100), nullable=False)   
    celular = Base.Column(Base.String(15), nullable=True)  

    tipo = Base.Column(Base.Enum('gato', 'perro', name='tipo_animal'), nullable=False)

    cantidad = Base.Column(Base.Integer, nullable=False)
    edad = Base.Column(Base.Integer, nullable=False)

    unidad_medida = Base.Column(Base.Enum('años', 'meses', name='unidad_edad'), nullable=False)

    fecha_entrega = Base.Column(Base.Date, nullable=False)

    descripcion = Base.Column(Base.String(500), nullable=True) 

    # Relaciones
    fotos = Base.relationship('Foto', backref='actividad', cascade='all, delete-orphan', lazy=True)
    contactos = Base.relationship('ContactarPor', backref='actividad', cascade='all, delete-orphan', lazy=True)

class Foto(Base):
    __tablename__ = 'foto'

    id = Base.Column(Base.Integer, primary_key=True, autoincrement=True)

    ruta_archivo = Base.Column(Base.String(300), nullable=False)      # Ej: 'uploads/perros/'
    nombre_archivo = Base.Column(Base.String(300), nullable=False)    # Ej: 'foto123.jpg'

    actividad_id = Base.Column(Base.Integer, Base.ForeignKey('actividad.id'), nullable=False)


class ContactarPor(Base):
    __tablename__ = 'contactar_por'

    id = Base.Column(Base.Integer, primary_key=True, autoincrement=True)

    nombre = Base.Column(Base.Enum(('WhatsApp', 'Instagram', 'Facebook', 'Telegram', 'X', 'Otro'), name='tipo_contacto'), nullable=False)
    identificador = Base.Column(Base.String(150), nullable=False) # Ej: '@usuario' o número

    actividad_id = Base.Column(Base.Integer, Base.ForeignKey('actividad.id'), nullable=False)

# --- Database Functions ---

# Crear un aviso
def create_aviso(comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion):
    session = SessionLocal()
    nuevo_aviso = Aviso(
        comuna_id=comuna_id,
        sector=sector,
        nombre=nombre,
        email=email,
        celular=celular,
        tipo=tipo,
        cantidad=cantidad,
        edad=edad,
        unidad_medida=unidad_medida,
        fecha_entrega=fecha_entrega,
        descripcion=descripcion
    )
    session.add(nuevo_aviso)
    session.commit()
    session.refresh(nuevo_aviso)
    session.close()
    return nuevo_aviso


# Obtener un aviso por ID (con comuna y región si usas joinedload)
def get_aviso_by_id(aviso_id):
    session = SessionLocal()
    aviso = session.query(Aviso).filter_by(id=aviso_id).first()
    session.close()
    return aviso


# Obtener todas las fotos de un aviso
def get_fotos_by_aviso_id(aviso_id):
    session = SessionLocal()
    fotos = session.query(Foto).filter_by(actividad_id=aviso_id).all()
    session.close()
    return fotos


# Obtener todas las formas de contacto de un aviso
def get_contactos_by_aviso_id(aviso_id):
    session = SessionLocal()
    contactos = session.query(ContactarPor).filter_by(actividad_id=aviso_id).all()
    session.close()
    return contactos


# Crear una foto para un aviso
def create_foto(ruta_archivo, nombre_archivo, actividad_id):
    session = SessionLocal()
    nueva_foto = Foto(
        ruta_archivo=ruta_archivo,
        nombre_archivo=nombre_archivo,
        actividad_id=actividad_id
    )
    session.add(nueva_foto)
    session.commit()
    session.close()


# Crear una forma de contacto
def create_contactar_por(tipo_contacto, identificador, actividad_id):
    session = SessionLocal()
    nuevo_contacto = ContactarPor(
        nombre=tipo_contacto,
        identificador=identificador,
        actividad_id=actividad_id
    )
    session.add(nuevo_contacto)
    session.commit()
    session.close()
