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

});
