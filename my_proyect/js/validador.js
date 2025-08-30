// validador.js

export const Validador = (() => {

  function validarMail(mail) {
    return mail && mail.includes("@") && mail.length < 101;
  }

  function validarCelular(celular) {
    return celular && /^\+\d{3}\.\d{8}$/.test(celular);
  }

  function validarGeneral(texto) {
    return texto && texto.length > 3 && texto.length < 201;
  }

  function validarFotos(input) {
    return input.files && input.files.length > 0;
  }

  function validarRadio(name) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    return Array.from(radios).some(r => r.checked);
  }
  function validarCantidad(cantidad) {
    return cantidad && Number.isInteger(Number(cantidad)) && Number(cantidad) > 0 && Number(cantidad) < 30;
  }
  function validarEdad(edad) {
    return edad && Number.isInteger(Number(edad)) && Number(edad) > 0 && Number(edad) < 20;
  }


  function limitarLargoConAviso(input, min, max) {
    const mensaje = input.nextElementSibling; // asumo que es el <small> para mensajes
    const largo = input.value.length;

    if (largo > max) {
      input.value = input.value.slice(0, max); // corta el texto a máximo
      mensaje.textContent = `Máximo ${max} caracteres permitidos.`;
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
    } else if (largo < min) {
      mensaje.textContent = `Mínimo ${min} caracteres requeridos.`;
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
    } else {
      mensaje.textContent = '';
      mensaje.style.display = 'none';
      input.classList.remove('input-error');
    }
  }

  function validarNumeroConAviso(input, min, max) {
    const mensaje = input.nextElementSibling;
    const valor = input.value.trim();

    mensaje.textContent = '';
    mensaje.style.display = 'none';
    input.classList.remove('input-error');

    if (valor === '') {
      mensaje.textContent = 'Este campo es obligatorio.';
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
      return false;
    }

    const numero = Number(valor);

    if (isNaN(numero)) {
      mensaje.textContent = 'Debe ser un número válido.';
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
      return false;
    }

    if (numero < min) {
      mensaje.textContent = `El valor debe ser al menos ${min}.`;
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
      return false;
    }

    if (numero > max) {
      mensaje.textContent = `El valor no debe superar ${max}.`;
      mensaje.style.display = 'inline';
      input.classList.add('input-error');
      return false;
    }

    return true;
  }

  return {
    validarMail,
    validarCelular,
    validarGeneral,
    limitarLargoConAviso,
    validarFotos,
    validarRadio,
    validarCantidad,
    validarEdad,
    validarNumeroConAviso
  };
})();
