import { region_comuna } from './region_comuna.js';
import { Validador } from './validador.js';

// --- FUNCIONES DE AYUDA ---

async function actualizarComunas(regionSelectId = 'region', comunaSelectId = 'comuna') {
  const regionSelect = document.getElementById(regionSelectId);
  const comunaSelect = document.getElementById(comunaSelectId);

  if (!regionSelect || !comunaSelect) return;

  // 1. Cargar regiones
  try {
    const regiones = await fetch('/api/regiones').then(res => res.json());
    regiones.forEach(region => {
      const option = document.createElement('option');
      option.value = region.id;
      option.textContent = region.nombre;
      regionSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error cargando regiones:', err);
  }

  // 2. Cargar comunas al seleccionar región
  regionSelect.addEventListener('change', async () => {
    const regionId = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">Cargando comunas...</option>';

    try {
      const comunas = await fetch(`/api/comunas/${regionId}`).then(res => res.json());
      comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
      comunas.forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna.id;
        option.textContent = comuna.nombre;
        comunaSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Error cargando comunas:', err);
      comunaSelect.innerHTML = '<option value="">Error al cargar comunas</option>';
    }
  });
}

// function mostrarErrores(errores) {
//   errores.forEach(({ campo, mensaje }) => {
//     const input = document.getElementById(campo);
//     if (!input) return;

//     limpiarError(input);

//     const error = document.createElement("div");
//     error.className = "error";
//     error.textContent = mensaje;

//     input.classList.add("input-error");
//     input.parentNode.appendChild(error);
//   });
// }

function limpiarError(input) {
  input.classList.remove("input-error");
  const grupo = input.closest('.radio-group');
  if (grupo) grupo.classList.remove('input-error');
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

// --- FIN FUNCIONES DE AYUDA ---


// --- EVENTOS Y LÓGICA DEL DOM ---

document.addEventListener("DOMContentLoaded", () => {
  actualizarComunas();

  const mform = document.getElementById('form_aviso');

  // Limitar inputs con aviso
  document.querySelectorAll('.limitable').forEach(input => {
      const min = parseInt(input.dataset.minlength);
      const max = parseInt(input.dataset.maxlength);

      input.addEventListener('input', () => {
          Validador.limitarLargoConAviso(input, min, max);
      });
  });

  // Limitar inputs numéricos con aviso
  document.querySelectorAll('.limitable-num').forEach(input => {
    const min = parseInt(input.getAttribute("min"), 10);
    const max = parseInt(input.getAttribute("max"), 10);

    input.addEventListener('input', () => {
      Validador.validarNumeroConAviso(input, min, max);
    });
  });

  mform.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      limpiarError(input);
    });

    // Para radios, usamos 'change' porque 'input' no aplica
    if (input.type === 'radio') {
      input.addEventListener('change', () => {
        const grupo = input.closest('.radio-group');
        const mensaje = grupo.querySelector('.mensaje-error');
        grupo.classList.remove('input-error');
        if (mensaje) {
          mensaje.textContent = '';
          mensaje.style.display = 'none';
        }
      });
    }
  });

  document.getElementById("tipo-red").addEventListener("change", function() {
    var selectedRed = this.value;
    var inputRed = document.getElementById("dato-red");
    var agregarBtn = document.getElementById("agregar-red");
    var mensaje_error = document.getElementById("mensaje-error-red");

    // Si se selecciona una red social diferente a "Selecciona una red"
    if (selectedRed !== "") {
      inputRed.style.display = "inline-block"; // Mostrar el input
      agregarBtn.style.display = "inline-block"; // Mostrar el botón
    } else {
      inputRed.style.display = "none"; // Ocultar el input
      agregarBtn.style.display = "none"; // Ocultar el botón
      mensaje_error.style.display = "none"; // Ocultar mensaje de error
    }
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
    // Crear contenedor para el input y el botón
    const fotoWrapper = document.createElement('div');
    fotoWrapper.classList.add('foto-wrapper');
    fotoWrapper.style.marginTop = '10px';
    fotoWrapper.style.display = 'flex';
    fotoWrapper.style.alignItems = 'center';

    // Crear nuevo input
    const nuevoInput = document.createElement('input');
    nuevoInput.type = 'file';
    nuevoInput.name = 'fotos[]';
    nuevoInput.accept = 'image/*';
    nuevoInput.classList.add('foto-input');

    // Crear botón de eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.type = 'button';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.style.marginLeft = '10px';

    btnEliminar.addEventListener('click', () => {
      contenedorFotos.removeChild(fotoWrapper);
    });

    // Agregar al contenedor
    fotoWrapper.appendChild(nuevoInput);
    fotoWrapper.appendChild(btnEliminar);

    // Agregar al DOM
    contenedorFotos.appendChild(fotoWrapper);

    // Ocultar el botón "Agregar otra foto" hasta que se seleccione un archivo
    botonAgregar.style.display = 'none';
    });

    // Validación y modal de confirmación en el formulario
    const modal = document.getElementById('confirmModal');
    const siBtn = document.getElementById('btn-si');
    const noBtn = document.getElementById('btn-no');

    mform.addEventListener('submit', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });

    siBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      let esValido = true;

      const inputsObligatorios = mform.querySelectorAll('[required]');
      const gruposValidados = new Set();

      inputsObligatorios.forEach(input => limpiarError(input));
      const mensajesError = mform.querySelectorAll('.mensaje-error');
      mensajesError.forEach(m => {
        m.textContent = '';
        m.style.display = 'none';
      });

      const celularInput = document.getElementById("celular");
      const valorCelular = celularInput.value.trim();

      if (valorCelular !== "") {
        if (!Validador.validarCelular(valorCelular)) {
          esValido = false;
          const mensajeCelular = celularInput.parentElement.querySelector('.mensaje-error');
          mensajeCelular.textContent = "Formato inválido. Usa +569.12345678";
          mensajeCelular.style.display = 'inline';
          celularInput.classList.add("input-error");
        }
      }

      // Validaciones específicas
      inputsObligatorios.forEach(input => {
        if (input.type === 'radio') {
          const name = input.name;
          if (gruposValidados.has(name)) return;
          gruposValidados.add(name);

          const grupoContenedor = input.closest('.radio-group') || input.parentElement;
          const resultado = Validador.validarRadio(name);
          const mensajeErrorRadio = grupoContenedor.querySelector('.mensaje-error');

          if (!resultado.valido) {
            esValido = false;
            if (mensajeErrorRadio) {
              mensajeErrorRadio.textContent = resultado.mensaje;
              mensajeErrorRadio.style.display = 'inline';
            }
            grupoContenedor.classList.add("input-error");
          }
          return;
        }

        if (input.id === "cantidad" || input.id === "edad") {
          const min = parseInt(input.getAttribute("min"), 10);
          const max = parseInt(input.getAttribute("max"), 10);
          if (!Validador.validarNumeroConAviso(input, min, max)) {
            esValido = false;
            input.classList.add('input-error');
          }
          return;
        }

        if (!input.checkValidity()) {
          esValido = false;
          input.classList.add('input-error');
        }

        if (input.type === "email") {
          const valor = input.value.trim();
          const mensajeMail = input.parentElement.querySelector('.mensaje-error');
          if (!Validador.validarMail(valor)) {
            esValido = false;
            mensajeMail.textContent = "Email inválido.";
            mensajeMail.style.display = 'inline';
            input.classList.add("input-error");
          }
        }

        if (input.id === "nombre") {
          if (!Validador.validarNombre(input.value)) {
            esValido = false;
            const mensajeNombre = input.parentElement.querySelector('.mensaje-error');
            mensajeNombre.textContent = "El nombre debe tener entre 4 y 200 caracteres.";
            mensajeNombre.style.display = 'inline';
            input.classList.add("input-error");
          }
        }
      });

      // Validación de al menos una foto
      const fotoInputs = mform.querySelectorAll('input[type="file"][name="fotos[]"]');
      const tieneFoto = Array.from(fotoInputs).some(f => f.files.length > 0);
      const contenedorFotos = document.getElementById('contenedor-fotos');
      const mensajeFotos = contenedorFotos.querySelector('.mensaje-error');

      if (!tieneFoto) {
        esValido = false;
        contenedorFotos.classList.add('input-error');
        if (mensajeFotos) {
          mensajeFotos.textContent = "Debe subir al menos una foto.";
          mensajeFotos.style.display = "inline";
        }
      }

      if (!esValido) {
        mostrarMensajeError("Por favor llenar los datos obligatorios correctamente o verifique los opcionales.");
        return;
      }

      // --- ENVIAR FORMULARIO CON FETCH ---
      const formData = new FormData(mform);

      // Agregar redes sociales desde `redesAgregadas`
      redesAgregadas.forEach(({ tipo, dato }) => {
        formData.append('tipo_contacto[]', tipo);
        formData.append('identificador[]', dato);
      });
      fetch('/form_add', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const success = document.getElementById('mensajeExito');
            if (success) success.style.display = 'block';

            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          } else {
            mostrarMensajeError("Hubo un error: " + data.error);
          }
        })
        .catch(err => {
          console.error(err);
          mostrarMensajeError("Error inesperado al enviar el formulario.");
        });
    });


    noBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
});
