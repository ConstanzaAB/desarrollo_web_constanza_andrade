import { region_comuna } from './region_comuna.js';
import { Validador } from './validador.js';

// --- FUNCIONES DE AYUDA ---

const regionKeyToName = {
  "arica": "Región Arica y Parinacota",
  "tarapaca": "Región de Tarapacá",
  "antofagasta": "Región de Antofagasta",
  "atacama": "Región de Atacama",
  "coquimbo": "Región de Coquimbo",
  "valparaiso": "Región de Valparaíso",
  "metropolitana": "Región Metropolitana de Santiago",
  "ohiggins": "Región del Libertador Bernardo Ohiggins",
  "maule": "Región del Maule",
  "nuble": "Región del Ñuble",
  "biobio": "Región del Biobío",
  "araucania": "Región de La Araucanía",
  "los-rios": "Región de Los Ríos",
  "los-lagos": "Región de Los Lagos",
  "aysen": "Región Aisén del General Carlos Ibáñez del Campo",
  "magallanes": "Región de Magallanes y la Antártica Chilena"
};

function actualizarComunas(regionSelectId = 'region', comunaSelectId = 'comuna') {
  const regionSelect = document.getElementById(regionSelectId);
  const comunaSelect = document.getElementById(comunaSelectId);

  if (!regionSelect || !comunaSelect) return;

  regionSelect.addEventListener("change", () => {
    const regionKey = regionSelect.value;
    const regionNombre = regionKeyToName[regionKey];

    const regionData = region_comuna.regiones.find(r => r.nombre.trim() === regionNombre);
    const comunas = regionData ? regionData.comunas : [];

    comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';

    comunas.forEach(comuna => {
      const option = document.createElement("option");
      option.value = comuna.nombre.toLowerCase().replace(/\s+/g, "-");
      option.textContent = comuna.nombre;
      comunaSelect.appendChild(option);
    });
  });
}

function mostrarErrores(errores) {
  errores.forEach(({ campo, mensaje }) => {
    const input = document.getElementById(campo);
    if (!input) return;

    limpiarError(input);

    const error = document.createElement("div");
    error.className = "error";
    error.textContent = mensaje;

    input.classList.add("input-error");
    input.parentNode.appendChild(error);
  });
}

function limpiarError(input) {
  input.classList.remove("input-error");
  const error = input.parentNode.querySelector(".error");
  if (error) error.remove();
}

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

function abrirModal(src,alt) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("imagenAmpliada").src = src;
  document.getElementById("imagenAmpliada").alt = alt;
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

// --- FIN FUNCIONES DE AYUDA ---


// --- EVENTOS Y LÓGICA DEL DOM ---

document.addEventListener("DOMContentLoaded", () => {
  actualizarComunas();

  // Limitar inputs con aviso
document.querySelectorAll('.limitable').forEach(input => {
    const min = parseInt(input.dataset.minlength);
    const max = parseInt(input.dataset.maxlength);

    input.addEventListener('input', () => {
        !Validador.limitarLargoConAviso(input, min, max);
    });
});

  // Manejo de redes sociales
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

  // Contenedor y botón para agregar fotos
  const contenedorFotos = document.getElementById('contenedor-fotos');
  const botonAgregar = document.getElementById('agregar-foto');

  contenedorFotos.addEventListener('change', (e) => {
    if (e.target && e.target.matches('input[type="file"]')) {
      if (e.target.files.length > 0) {
        botonAgregar.style.display = 'inline-block';
      }
    }
  });

  botonAgregar.addEventListener('click', () => {
    const nuevoInput = document.createElement('input');
    nuevoInput.type = 'file';
    nuevoInput.name = 'fotos[]';
    nuevoInput.accept = 'image/*';
    nuevoInput.classList.add('foto-input');
    nuevoInput.style.marginTop = '10px';

    contenedorFotos.appendChild(nuevoInput);
    botonAgregar.style.display = 'none';
  });

  // Validación y modal de confirmación en el form
  const form = document.getElementById('form_aviso');
  const modal = document.getElementById('confirmModal');
  const siBtn = document.getElementById('btn-si');
  const noBtn = document.getElementById('btn-no');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  siBtn.addEventListener('click', () => {
    const inputsObligatorios = form.querySelectorAll('[required]');
    let esValido = true;

    // Limpiar errores anteriores
    inputsObligatorios.forEach(input => limpiarError(input));

    // Validar campos requeridos y con funciones del validador según id o tipo (ejemplo)
    inputsObligatorios.forEach(input => {
      if (!input.checkValidity()) {
        esValido = false;
        input.classList.add('input-error');
      } else {
        // Ejemplo validación adicional según id
        if (input.id === "email" && !Validador.validarMail(input.value)) {
          esValido = false;
          input.classList.add('input-error');
        }
        if (input.id === "celular" && !Validador.validarCelular(input.value)) {
          esValido = false;
          input.classList.add('input-error');
        }
        if ((input.id === "nombre" || input.id === "apellido") && !Validador.validarGeneral(input.value)) {
          esValido = false;
          input.classList.add('input-error');
        }
      }
    });

    if (!esValido) {
      modal.style.display = 'none';
      mostrarMensajeError("Por favor llenar los datos obligatorios correctamente.");
      return;
    }

    // Éxito: enviar form o simular envío
    modal.style.display = 'none';
    const success = document.getElementById('mensajeExito');
    if (success) success.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  });

  noBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
