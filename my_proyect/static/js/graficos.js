document.addEventListener('DOMContentLoaded', () => {
  cargarGraficoLineas();
  cargarGraficoTorta();
  cargarGraficoBarras();
});

const getColor = (varName) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

async function cargarGraficoLineas() { //Gráfico para los avisos por día 
  const res = await fetch('/api/avisos_por_dia'); //obtenemos los datos
  const data = await res.json();//Los transformamos a JSON

  const fechas = data.map(d => d.fecha);
  const cantidades = data.map(d => d.cantidad);

  const colorPrincipal = getColor('--color-principal');

  new Chart(document.getElementById('graficoLineas'), {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Avisos por día',
        data: cantidades,
        borderColor: colorPrincipal,
        backgroundColor: colorPrincipal + '33', // color transparente
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

async function cargarGraficoTorta() { //Gráfico de torta por especies (perro y gato) en total
  const res = await fetch('/api/avisos_por_tipo');//obtenemos los datos
  const data = await res.json();//Los transformamos a JSON

  const tipos = data.map(d => d.tipo);
  const cantidades = data.map(d => d.cantidad);

  const colorPrincipal = getColor('--color-principal');
  const colorSecundario = getColor('--color-secundario');

  const colores = tipos.map(tipo =>
    tipo.toLowerCase() === 'gato' ? colorPrincipal : colorSecundario
  );

  new Chart(document.getElementById('graficoTorta'), {
    type: 'pie',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Avisos por tipo',
        data: cantidades,
        backgroundColor: colores
      }]
    }
  });
}

async function cargarGraficoBarras() { //Gráfico de barra por especie cada mes 
  const res = await fetch('/api/avisos_por_mes_y_tipo');//obtenemos los datos
  const data = await res.json();//Los transformamos a JSON

  const meses = Object.keys(data).map(m => parseInt(m)).sort((a, b) => a - b);
  const etiquetas = meses.map(m => new Date(0, m - 1).toLocaleString('es-CL', { month: 'long' }));

  const datosPerros = meses.map(m => data[m]?.perro || 0);
  const datosGatos = meses.map(m => data[m]?.gato || 0);

  const colorPrincipal = getColor('--color-principal');
  const colorSecundario = getColor('--color-secundario');

  new Chart(document.getElementById('graficoBarras'), {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: 'Perros',
          data: datosPerros,
          backgroundColor: colorSecundario
        },
        {
          label: 'Gatos',
          data: datosGatos,
          backgroundColor: colorPrincipal
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}
