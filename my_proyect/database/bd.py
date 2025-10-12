from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime, Date, Enum, desc, func, extract
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload
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

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    # Una región tiene muchas comunas
    comunas = relationship('Comuna', backref='region', lazy=True)


class Comuna(Base):
    __tablename__ = 'comuna'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    region_id = Column(Integer, ForeignKey('region.id'), nullable=False)


class Aviso(Base):
    __tablename__ = 'aviso_adopcion'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha_ingreso = Column(DateTime, nullable=False, default=datetime.now)

    comuna_id = Column(Integer, ForeignKey('comuna.id'), nullable=False)
    sector = Column(String(100), nullable=True)  

    nombre = Column(String(200), nullable=False)  
    email = Column(String(100), nullable=False)   
    celular = Column(String(15), nullable=True)  

    tipo = Column(Enum('gato', 'perro', name='tipo_animal'), nullable=False)

    cantidad = Column(Integer, nullable=False)
    edad = Column(Integer, nullable=False)

    unidad_medida = Column(Enum('a', 'm', name='unidad_edad'), nullable=False)

    fecha_entrega = Column(Date, nullable=False)

    descripcion = Column(String(500), nullable=True) 

    # Relaciones
    fotos = relationship('Foto', backref='aviso', cascade='all, delete-orphan', lazy=True)
    contactos = relationship('ContactarPor', backref='aviso', cascade='all, delete-orphan', lazy=True)
    comuna = relationship('Comuna', backref='aviso')

class Foto(Base):
    __tablename__ = 'foto'

    id = Column(Integer, primary_key=True, autoincrement=True)

    ruta_archivo = Column(String(300), nullable=False)      # Ej: 'uploads/perros/'
    nombre_archivo = Column(String(300), nullable=False)    # Ej: 'foto123.jpg'

    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)


class ContactarPor(Base):
    __tablename__ = 'contactar_por'

    id = Column(Integer, primary_key=True, autoincrement=True)

    nombre = Column(Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra', name='tipo_contacto'), nullable=False)
    identificador = Column(String(150), nullable=False) # Ej: '@usuario' o número

    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)


class Comentario(Base):
    __tablename__ = 'comentario'
    id = Column(Integer, primary_key=True, autoincrement=True)

    nombre = Column(String(80), nullable=False)
    texto = Column(String(300), nullable=False)
    fecha = Column(DateTime, nullable=False)

    aviso_id = Column(Integer, ForeignKey('aviso_adopcion.id'), nullable=False)


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

def get_all_avisos():
    session = SessionLocal()
    try:
        # Cargar los avisos con las relaciones necesarias (comuna, fotos, contactos)
        avisos = session.query(Aviso).options(
            joinedload(Aviso.comuna).joinedload(Comuna.region),  # Cargar la región asociada a la comuna
            joinedload(Aviso.fotos),  # Cargar todas las fotos asociadas al aviso
            joinedload(Aviso.contactos)  # Cargar todas las formas de contacto asociadas al aviso
        ).all()
        
        return avisos
    finally:
        session.close()

def get_ultimos_5_avisos():
    session = SessionLocal()
    try:
        avisos = session.query(Aviso).options(
            joinedload(Aviso.comuna).joinedload(Comuna.region),
            joinedload(Aviso.fotos)
        ).order_by(desc(Aviso.fecha_ingreso)).limit(5).all()

        return avisos
    finally:
        session.close()

# Obtener un aviso por ID (con comuna y región si usas joinedload)
def get_aviso_by_id(aviso_id):
    session = SessionLocal()
    try:
        aviso = session.query(Aviso).options(
            joinedload(Aviso.comuna).joinedload(Comuna.region),
            joinedload(Aviso.fotos),
            joinedload(Aviso.contactos)
        ).filter(Aviso.id == aviso_id).first()
        return aviso
    finally:
        session.close()

def get_all_regiones():
    session = SessionLocal()
    try:
        regiones = session.query(Region).order_by(Region.nombre).all()
        return regiones
    finally:
        session.close()

def get_comunas_por_region(region_id):
    session = SessionLocal()
    try:
        comunas = session.query(Comuna).filter_by(region_id=region_id).order_by(Comuna.nombre).all()
        return comunas
    finally:
        session.close()

# Obtener todas las fotos de un aviso
def get_fotos_by_aviso_id(aviso_id):
    session = SessionLocal()
    fotos = session.query(Foto).filter_by(aviso_id=aviso_id).all()
    session.close()
    return fotos


# Obtener todas las formas de contacto de un aviso
def get_contactos_by_aviso_id(aviso_id):
    session = SessionLocal()
    contactos = session.query(ContactarPor).filter_by(aviso_id=aviso_id).all()
    session.close()
    return contactos


# Crear una foto para un aviso
def create_foto(ruta_archivo, nombre_archivo, aviso_id):
    session = SessionLocal()
    nueva_foto = Foto(
        ruta_archivo=ruta_archivo,
        nombre_archivo=nombre_archivo,
        aviso_id=aviso_id
    )
    session.add(nueva_foto)
    session.commit()
    session.close()


# Crear una forma de contacto
def create_contactar_por(tipo_contacto, identificador, aviso_id):
    session = SessionLocal()
    nuevo_contacto = ContactarPor(
        nombre=tipo_contacto,
        identificador=identificador,
        aviso_id=aviso_id
    )
    session.add(nuevo_contacto)
    session.commit()
    session.close()

def create_comentario(nombre, texto, fecha, aviso_id):
    session = SessionLocal()
    nuevo_comentario = Comentario(
        nombre=nombre,
        texto=texto,
        fecha=fecha,
        aviso_id=aviso_id
    )
    session.add(nuevo_comentario)
    session.commit()
    session.close()

def get_comentarios_by_aviso_id(aviso_id):
    session = SessionLocal()
    try:
        comentarios = (
            session.query(Comentario)
            .filter(Comentario.aviso_id == aviso_id)
            .order_by(Comentario.fecha.desc())  # Ordenar del más reciente al más antiguo
            .all()
        )
        return comentarios
    finally:
        session.close()

def get_avisos_por_dia():
    session = SessionLocal()
    try:
        datos = (
            session.query(func.date(Aviso.fecha_ingreso), func.count(Aviso.id))
            .group_by(func.date(Aviso.fecha_ingreso))
            .order_by(func.date(Aviso.fecha_ingreso))
            .all()
        )
        return [
            {"fecha": fecha.strftime("%Y-%m-%d"), "cantidad": cantidad}
            for fecha, cantidad in datos
        ]
    finally:
        session.close()

def get_avisos_por_tipo():
    session = SessionLocal()
    try:
        datos = (
            session.query(Aviso.tipo, func.count(Aviso.id))
            .group_by(Aviso.tipo)
            .all()
        )
        return [
            {"tipo": tipo, "cantidad": cantidad}
            for tipo, cantidad in datos
        ]
    finally:
        session.close()

def get_avisos_por_mes_y_tipo():
    session = SessionLocal()
    try:
        datos = (
            session.query(
                extract('month', Aviso.fecha_ingreso).label('mes'),
                Aviso.tipo,
                func.count(Aviso.id)
            )
            .group_by('mes', Aviso.tipo)
            .order_by('mes')
            .all()
        )
        resultado = {}
        for mes, tipo, cantidad in datos:
            mes = str(int(mes))  # ej: "1", "2"
            if mes not in resultado:
                resultado[mes] = {'perro': 0, 'gato': 0}
            resultado[mes][tipo] = cantidad
        return resultado
    finally:
        session.close()

