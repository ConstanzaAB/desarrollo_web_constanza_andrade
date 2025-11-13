document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalEvaluar");
  const cerrarModal = document.getElementById("cerrarModal");
  const form = document.getElementById("formEvaluar");
  const selectNota = document.getElementById("nota");

  let avisoIdSeleccionado = null;

  // Abrir modal
  document.querySelectorAll(".btn-evaluar").forEach(btn => {
    btn.addEventListener("click", () => {
      avisoIdSeleccionado = btn.getAttribute("data-id");
      modal.style.display = "flex";
    });
  });

  // Cerrar modal
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  // Enviar nota
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!avisoIdSeleccionado) return;

    const nota = selectNota.value;
    const response = await fetch(`/avisos/${avisoIdSeleccionado}/evaluar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota: parseInt(nota) })
    });

    const result = await response.json();

    if (response.ok) {
      // ✅ Mostrar mensaje arriba
      mostrarMensaje(result.message);

      // ✅ Actualizar el promedio en la tabla
      const fila = document.querySelector(`button[data-id="${avisoIdSeleccionado}"]`)
        .closest("tr")
        .querySelector("td:nth-child(6)");
      fila.textContent = result.promedio;

      // Cerrar modal
      modal.style.display = "none";
      form.reset();
    } else {
      alert("Error al guardar la nota");
    }
  });

  function mostrarMensaje(texto) {
    const mensaje = document.createElement("div");
    mensaje.textContent = texto;
    mensaje.classList.add("mensaje-exito"); // usa el estilo del CSS
    document.body.appendChild(mensaje);

    // eliminar después de 2.5 segundos
    setTimeout(() => mensaje.remove(), 2500);
  }
});
