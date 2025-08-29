// validador.js

export const Validador = (() => {

  function validarMail(mail) {
    return mail && mail.includes("@") && mail.length < 101;
  }

  function validarCelular(celular) {
    return /^\+\d{3}\.\d{8}$/.test(celular);
  }

  function validarGeneral(texto) {
    return texto && texto.length > 3 && texto.length < 201;
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


  return {
    validarMail,
    validarCelular,
    validarGeneral,
    limitarLargoConAviso,
  };
})();
