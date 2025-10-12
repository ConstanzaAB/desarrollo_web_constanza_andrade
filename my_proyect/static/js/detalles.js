
document.addEventListener('DOMContentLoaded', () => {
  
  const modal = document.getElementById("modal");
  const imagenAmpliada = document.getElementById("imagenAmpliada");
  const cerrarBtn = document.querySelector(".cerrar-img-modal");

  // Abrir modal al hacer clic en la miniatura
  document.querySelectorAll(".imagen-miniatura").forEach(imagen => {
    imagen.addEventListener("click", () => {
      modal.style.display = "block";
      imagenAmpliada.src = imagen.src;
      imagenAmpliada.alt = imagen.alt;
    });
  });

  // Cerrar al hacer clic en la X
  cerrarBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar al hacer clic fuera de la imagen
  modal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Evitar cierre si se hace clic dentro del contenido
  modal.querySelector(".modal-contenido").addEventListener("click", e => {
    e.stopPropagation();
  });

  // Cerrar con tecla Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.style.display = "none";
  });

  // <- Botón Volver Atrás
  const volverBtn = document.getElementById("btn-volver");
  if (volverBtn) {
    const targetUrl = volverBtn.dataset.url;
    volverBtn.addEventListener("click", () => {
      window.location.href = targetUrl;
    });
  }
  const inicioBtn = document.getElementById("btn-inicio");
  if (inicioBtn) {
    const inicioUrl = inicioBtn.dataset.url;
    inicioBtn.addEventListener("click", () => {
      window.location.href = inicioUrl;
    });
  }

  // --- COMENTARIOS ---

  function validarComentario(texto) {
      return texto && texto.length > 2 && texto.length < 301;
  }

  function validarNombreCom(texto) {
      return texto && texto.length > 4 && texto.length < 81;
  }

  const avisoId = document.getElementById('form-comentario')?.dataset.avisoId;
  const listaComentarios = document.getElementById('lista-comentarios');
  const formComentario = document.getElementById('form-comentario');

  if (avisoId && listaComentarios && formComentario) {
    const errorContainer = document.createElement('div');
    errorContainer.style.color = 'red';
    errorContainer.style.marginTop = '10px';
    formComentario.appendChild(errorContainer);

    // Función para mostrar comentarios
    function renderComentarios(comentarios) {
      listaComentarios.innerHTML = '';
      const countEl = document.getElementById('comentario-count');

      if (countEl) countEl.textContent = `Comentarios (${comentarios.length})`;

      if (comentarios.length === 0) {
        listaComentarios.innerHTML = '<p class="comentario-vacio">No hay comentarios aún.</p>';
        return;
      }

      comentarios.forEach(({ nombre, texto, fecha }) => {
        const div = document.createElement('div');
        div.classList.add('comentario');

        div.innerHTML = `
          <div class="comentario-header">
            <strong class="comentario-nombre">${escapeHtml(nombre)}</strong>
            <span class="comentario-fecha">${fecha}</span>
          </div>
          <p class="comentario-texto">${escapeHtml(texto)}</p>
        `;

        listaComentarios.appendChild(div);
      });
    }


    // Escape para evitar XSS
    function escapeHtml(text) {
      return text.replace(/[&<>"']/g, function (m) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[m];
      });
    }

    // Cargar comentarios al inicio
    fetch(`/api/comentarios/${avisoId}`)
      .then(res => res.json())
      .then(data => {
        renderComentarios(data);
      })
      .catch(() => {
        listaComentarios.innerHTML = '<li>Error cargando comentarios.</li>';
      });

    // Enviar comentario
    formComentario.addEventListener('submit', e => {
      e.preventDefault();

      errorContainer.textContent = ''; // limpiar errores

      const nombreInput = formComentario.querySelector('input[name="nombre"]');
      const textoInput = formComentario.querySelector('textarea[name="texto"]');

      const nombre = nombreInput.value.trim();
      const texto = textoInput.value.trim();

      // Validaciones
      const errores = [];
      if (!validarNombreCom(nombre)) {
        errores.push('El nombre debe tener entre 5 y 80 caracteres.');
      }
      if (!validarComentario(texto)) {
        errores.push('El comentario debe tener entre 4 y 300 caracteres.');
      }

      if (errores.length > 0) {
        errorContainer.innerHTML = errores.map(err => `<p>${err}</p>`).join('');
        return;
      }

      // Envío si pasa validación
      fetch('/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, texto, aviso_id: avisoId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Limpiar errores y campos
            errorContainer.style.color = 'green';
            errorContainer.textContent = 'Comentario enviado correctamente.';
            nombreInput.value = '';
            textoInput.value = '';
            // Recargar comentarios
            return fetch(`/api/comentarios/${avisoId}`);
          } else {
            throw new Error(data.mensaje || 'Error al enviar comentario');
          }
        })
        .then(res => res.json())
        .then(data => {
          renderComentarios(data);
          errorContainer.style.color = 'green';
        })
        .catch(err => {
          errorContainer.style.color = 'red';
          errorContainer.textContent = err.message;
        });
    });
  }
});
