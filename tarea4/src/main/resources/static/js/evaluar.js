document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalEvaluar");
  const cerrarModal = document.getElementById("cerrarModal");
  const form = document.getElementById("formEvaluar");
  const selectNota = document.getElementById("nota");

  let avisoIdSeleccionado = null;

  // Abre el modal
  document.querySelectorAll(".btn-evaluar").forEach(btn => {
    btn.addEventListener("click", () => {
      avisoIdSeleccionado = btn.getAttribute("data-id");
      modal.style.display = "flex";
    });
  });

  // Cierra el modal
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  // Envia la nota
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
      // Muestra el mensaje en la parte de arriba
      mostrarMensaje(result.message);

      // Actualizar el promedio en la tabla columna Nota (6ta columna)
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
    mensaje.classList.add("mensaje-exito"); // usa el estilo del CSS definido
    document.body.appendChild(mensaje);

    // se elimina después de 2.5 segundos
    setTimeout(() => mensaje.remove(), 2500);
  }
});
