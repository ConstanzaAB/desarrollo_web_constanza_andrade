// app.js
const Formulario = (() => {
  const comunasPorRegion = {
    arica: ["Arica", "Camarones", "Putre", "General Lagos"],
    tarapaca: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
    antofagasta: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama"],
    atacama: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Freirina", "Huasco"],
    coquimbo: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    valparaiso: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana", "Quintero", "Puchuncaví", "Casablanca", "San Antonio", "Cartagena", "El Tabo", "El Quisco", "Algarrobo", "Santo Domingo"],
    metropolitana: ["Santiago", "Providencia", "Ñuñoa", "Puente Alto", "Maipú", "Las Condes", "La Florida", "Lo Barnechea", "Pudahuel", "San Bernardo", "La Reina", "Peñalolén"],
    ohiggins: ["Rancagua", "Machalí", "San Fernando", "Santa Cruz", "Rengo", "Pichilemu", "Graneros", "Mostazal", "Requínoa"],
    maule: ["Talca", "Curicó", "Linares", "Cauquenes", "San Javier", "Parral", "Constitución", "Maule"],
    nuble: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes", "Yungay", "Quillón"],
    biobio: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel", "Lota", "Los Ángeles", "Hualpén", "Chiguayante"],
    araucania: ["Temuco", "Padre Las Casas", "Angol", "Villarrica", "Pucón", "Nueva Imperial", "Lautaro"],
    "los-rios": ["Valdivia", "La Unión", "Río Bueno", "Paillaco", "Futrono", "Panguipulli"],
    "los-lagos": ["Puerto Montt", "Osorno", "Castro", "Ancud", "Quellón", "Frutillar", "Puerto Varas"],
    aysen: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"],
    magallanes: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
  };

  function actualizarComunas(regionSelectId = 'region', comunaSelectId = 'comuna') {
    const regionSelect = document.getElementById(regionSelectId);
    const comunaSelect = document.getElementById(comunaSelectId);

    if (!regionSelect || !comunaSelect) return;

    regionSelect.addEventListener("change", () => {
      const region = regionSelect.value;
      const comunas = comunasPorRegion[region] || [];

      comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

      comunas.forEach(comuna => {
        const option = document.createElement("option");
        option.value = comuna.toLowerCase().replace(/\s+/g, "-");
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    });
  }

  const validadorMail = (mail) => mail && mail.includes("@") && mail.length < 101;
  const validadorCelular = (celular) => /^\+\d{3}\.\d{8}$/.test(celular);
  const validadorGeneral = (input) => input && input.length > 3 && input.length < 201;

  return {
    init() {
      actualizarComunas();
    },
    validadorMail,
    validadorGeneral,
    validadorCelular
  };
})();

// zoom imagen
function abrirModal(src) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("imagenAmpliada").src = src;
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}


document.addEventListener("DOMContentLoaded", () => {
  // Inicializar comunas dinámicas
  Formulario.init();

  // Gestión de redes sociales
  const btnAgregar = document.getElementById("agregar-red");
  const selectRed = document.getElementById("tipo-red");
  const inputDato = document.getElementById("dato-red");
  const listaRedes = document.getElementById("lista-redes");

  let redesAgregadas = [];

  btnAgregar.addEventListener("click", () => {
    const tipo = selectRed.value;
    const dato = inputDato.value.trim();

    if (!tipo || !dato) {
      alert("Selecciona una red y escribe el dato de contacto.");
      return;
    }

    if (redesAgregadas.length >= 5) {
      alert("Solo puedes agregar hasta 5 redes sociales.");
      return;
    }

    redesAgregadas.push({ tipo, dato });

    const li = document.createElement("li");
    li.textContent = `${tipo}: ${dato}`;

    const btnEliminar = document.createElement("button");
    btnEliminar.innerHTML = "X Eliminar";
    btnEliminar.addEventListener("click", () => {
      listaRedes.removeChild(li);
      redesAgregadas = redesAgregadas.filter(r => !(r.tipo === tipo && r.dato === dato));
    });

    li.appendChild(btnEliminar);
    listaRedes.appendChild(li);

    selectRed.value = "";
    inputDato.value = "";
  });

  // Fecha mínima para entrega
  const inputFecha = document.getElementById("fecha-entrega");
  const mostrarFecha = document.getElementById("fecha-mostrar");

  if (inputFecha && mostrarFecha) {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 3);

    const year = ahora.getFullYear();
    const month = String(ahora.getMonth() + 1).padStart(2, '0');
    const day = String(ahora.getDate()).padStart(2, '0');
    const hours = String(ahora.getHours()).padStart(2, '0');
    const minutes = String(ahora.getMinutes()).padStart(2, '0');

    const valor = `${year}-${month}-${day}T${hours}:${minutes}`;
    inputFecha.value = valor;
    inputFecha.min = valor;

    mostrarFecha.textContent = `La fecha mínima de entrega es: ${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const contenedorFotos = document.getElementById('contenedor-fotos');
  const botonAgregar = document.getElementById('agregar-foto');

  // Escuchar cambios en el contenedor de fotos
  contenedorFotos.addEventListener('change', (e) => {
    if (e.target && e.target.matches('input[type="file"]')) {
      // Mostrar el botón "Agregar" solo si hay un archivo seleccionado
      if (e.target.files.length > 0) {
        botonAgregar.style.display = 'inline-block';
      }
    }
  });

  // Al hacer clic en "Agregar", se añade un nuevo input file
  botonAgregar.addEventListener('click', () => {
    const nuevoInput = document.createElement('input');
    nuevoInput.type = 'file';
    nuevoInput.name = 'fotos[]';
    nuevoInput.accept = 'image/*';
    nuevoInput.classList.add('foto-input');
    nuevoInput.style.marginTop = '10px';

    contenedorFotos.appendChild(nuevoInput);
    botonAgregar.style.display = 'none'; // Ocultar el botón hasta que se seleccione la nueva imagen
  });

  function mostrarMensajeError(texto) {
    let mensaje = document.getElementById('mensajeError');
    
    if (!mensaje) {
      mensaje = document.createElement('div');
      mensaje.id = 'mensajeError';
      mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ffd2d2;
        color: #a40000;
        padding: 12px 20px;
        border: 1px solid #a40000;
        border-radius: 8px;
        z-index: 2000;
        font-size: 15px;
      `;
      document.body.appendChild(mensaje);
    }

    mensaje.textContent = texto;
    mensaje.style.display = 'block';

    setTimeout(() => {
      mensaje.style.display = 'none';
    }, 3000);
  }


  const form = document.getElementById('form_aviso');
  const modal = document.getElementById('confirmModal');
  const siBtn = document.getElementById('btn-si');
  const noBtn = document.getElementById('btn-no');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita el envío automático
    modal.style.display = 'flex'; // Muestra el modal
  });

  siBtn.addEventListener('click', () => {
    const form = document.getElementById('form_aviso');
    const inputsObligatorios = form.querySelectorAll('[required]');
    let esValido = true;

    // Elimina errores anteriores
    inputsObligatorios.forEach(input => {
      input.classList.remove('input-error');
    });

    // Verifica cada campo obligatorio
    inputsObligatorios.forEach(input => {
      if (!input.checkValidity()) {
        esValido = false;
        input.classList.add('input-error');
      }
    });

    if (!esValido) {
      // Oculta el modal
      modal.style.display = 'none';

      // Muestra mensaje de error
      mostrarMensajeError("Por favor llenar los datos obligatorios");

      return; // Detiene la ejecución
    }

    // Si todo es válido:
    modal.style.display = 'none';
    const success = document.getElementById('mensajeExito');
    success.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });


  noBtn.addEventListener('click', () => {
    modal.style.display = 'none'; // Oculta el modal
  });
});

