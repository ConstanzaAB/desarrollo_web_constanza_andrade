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

  // Función para actualizar comunas según la región seleccionada
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

  // Otros validadores o funciones del formulario pueden ir aquí
  const validadorMail = (mail) => mail && mail.includes("@") && mail.length<101;

  const validadorCelular = (celular) => {
    const regex = /^\+\d{3}\.\d{8}$/;
    return regex.test(celular);
  }

  const validadorGeneral = (input) => {
    let valido = false; // definicion de variables
    if (input && input.length > 3 && input.length < 201) {
      valido = true;
    }
    return valido;
  };
const validarForm = () => {
  console.log("Enviando..."); // imprimir en consola

  // obtener elementos del DOM por el ID
  let emailInput = document.getElementById("email");
  let nombreInput = document.getElementById("nombre");
  let apellidoInput = document.getElementById("apellido");
  let pwdInput = document.getElementById("contrasenna");

  let msg = "";

  if (!validadorMail(emailInput.value)) {
    msg += "Mail malo!\n";
    emailInput.style.borderColor = "red"; // cambiar estilo con JS!!
  } else {
    emailInput.style.borderColor = "";
  }

  if (!validadorNombre(nombreInput.value)) {
    msg += "Nombre malo!\n";
    nombreInput.style.borderColor = "red";
  } else {
    nombreInput.style.borderColor = "";
  }

  if (!validadorApellido(apellidoInput.value)) {
    msg += "Apellido malo!\n";
    apellidoInput.style.borderColor = "red";
  } else {
    apellidoInput.style.borderColor = "";
  }

  if (!validadorContrasena(pwdInput.value)) {
    msg += "Contraseña mala!\n";
    pwdInput.style.borderColor = "red";
  } else {
    pwdInput.style.borderColor = "";
  }

  if (msg === "") {
    msg = "Felicidades ya tienes una cuenta!";
  }
  alert(msg); // alertas JS
};
  // Exportar solo lo necesario
  return {
    init() {
      actualizarComunas();
      // Aquí puedes llamar a otras inicializaciones si las tienes
    },
    validadorMail,
    validadorGeneral,
    validadorCelular
    // etc.
  };
})();

document.addEventListener("DOMContentLoaded", function () {
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
    
    // Agregar botón para eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.innerHTML = "X Eliminar";
    btnEliminar.addEventListener("click", () => {
      listaRedes.removeChild(li);
      redesAgregadas = redesAgregadas.filter(r => !(r.tipo === tipo && r.dato === dato));
    });

    li.appendChild(btnEliminar);
    listaRedes.appendChild(li);

    // Limpiar campos
    selectRed.value = "";
    inputDato.value = "";
  });
});

document.addEventListener("DOMContentLoaded", function () {
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

    // Mostrar en formato YYYY-MM-DD HH:MM
    mostrarFecha.textContent = `La fecha mínima de entrega es: ${year}-${month}-${day} ${hours}:${minutes}`;
  }
});

(function () {
  const fotoGrupo = document.getElementById('foto-grupo');
  const maxFotos = 5;

  fotoGrupo.addEventListener('change', function (e) {
    // Solo actuamos si el cambio viene de un input file
    if (e.target && e.target.type === 'file') {
      const inputsFile = fotoGrupo.querySelectorAll('input[type="file"]');
      
      // Solo agregamos si hay menos de maxFotos inputs
      if (inputsFile.length < maxFotos) {
        // Verificamos que el input actual tenga un archivo seleccionado
        if (e.target.files.length > 0) {
          // Verificamos que el siguiente input no exista ya (para no agregar inputs repetidos)
          const nextIndex = inputsFile.length + 1;
          if (!document.getElementById('foto' + nextIndex)) {
            const nuevoInput = document.createElement('input');
            nuevoInput.type = 'file';
            nuevoInput.id = 'foto' + nextIndex;
            nuevoInput.name = 'fotos[]';
            nuevoInput.accept = 'image/*';

            // Insertamos después del último input file
            fotoGrupo.appendChild(nuevoInput);
          }
        }
      }
    }
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const modal = document.getElementById("confirm-modal");
  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // Mostrar modal
    modal.classList.remove("modal-hidden");
  });

  btnYes.addEventListener("click", () => {
    alert("Gracias por confirmar. Ahora serás redirigido al inicio.");
    window.location.href = "index.html"; // Cambia la URL según tu página de inicio
  });

  btnNo.addEventListener("click", () => {
    // Ocultar modal y volver al formulario sin borrar nada
    modal.classList.add("modal-hidden");
  });
});



// Ejecutar la inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  Formulario.init();
});
