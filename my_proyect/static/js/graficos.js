document.addEventListener('DOMContentLoaded', () => {
  cargarGraficoLineas();
  cargarGraficoTorta();
  cargarGraficoBarras();
});

async function cargarGraficoLineas() {
  const res = await fetch('/api/avisos_por_dia');
  const data = await res.json();

  const fechas = data.map(d => d.fecha);
  const cantidades = data.map(d => d.cantidad);

  new Chart(document.getElementById('graficoLineas'), {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Avisos por día',
        data: cantidades,
        borderColor: 'blue',
        fill: false
      }]
    }
  });
}

async function cargarGraficoTorta() {
  const res = await fetch('/api/avisos_por_tipo');
  const data = await res.json();

  const tipos = data.map(d => d.tipo);
  const cantidades = data.map(d => d.cantidad);

  new Chart(document.getElementById('graficoTorta'), {
    type: 'pie',
    data: {
      labels: tipos,
      datasets: [{
        label: 'Avisos por tipo',
        data: cantidades,
        backgroundColor: ['#f87979', '#79f8a9']
      }]
    }
  });
}

async function cargarGraficoBarras() {
  const res = await fetch('/api/avisos_por_mes_y_tipo');
  const data = await res.json();

  const meses = Object.keys(data).map(m => parseInt(m)).sort((a, b) => a - b);
  const etiquetas = meses.map(m => new Date(0, m - 1).toLocaleString('es-CL', { month: 'long' }));

  const datosPerros = meses.map(m => data[m]?.perro || 0);
  const datosGatos = meses.map(m => data[m]?.gato || 0);

  new Chart(document.getElementById('graficoBarras'), {
    type: 'bar',
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: 'Perros',
          data: datosPerros,
          backgroundColor: '#4d90fe'
        },
        {
          label: 'Gatos',
          data: datosGatos,
          backgroundColor: '#f4a261'
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
