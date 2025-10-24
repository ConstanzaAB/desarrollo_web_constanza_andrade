document.addEventListener('DOMContentLoaded', () => {
  cargarGraficoLineas();
  cargarGraficoTorta();
  cargarGraficoBarras();
});

const getColor = (varName) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

async function cargarGraficoLineas() {
  // Obtener los datos desde tu API
  const res = await fetch('/api/avisos_por_dia');
  const data = await res.json();

  // Procesar los datos
  const fechas = data.map(d => d.fecha);
  const cantidades = data.map(d => d.cantidad);

  const colorPrincipal = getColor('--color-principal'); // si ya tienes esta función definida

  // Crear el gráfico con Highcharts
  Highcharts.chart('graficoLineas', {
    chart: {
      type: 'line',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Avisos por día'
    },
    xAxis: {
      categories: fechas,
      title: { text: 'Fecha' }
    },
    yAxis: {
      title: { text: 'Cantidad' },
      allowDecimals: false,
      min: 0
    },
    series: [{
      name: 'Avisos por día',
      data: cantidades,
      color: colorPrincipal
    }],
    plotOptions: {
      line: {
        dataLabels: { enabled: true },
        enableMouseTracking: true
      }
    },
    credits: { enabled: false }, // oculta el logo de Highcharts
    responsive: {
      rules: [{
        condition: { maxWidth: 600 },
        chartOptions: { legend: { enabled: false } }
      }]
    }
  });
}

async function cargarGraficoTorta() { // Gráfico de torta por especies (perro y gato)
  const res = await fetch('/api/avisos_por_tipo');
  const data = await res.json();

  const colorPrincipal = getColor('--color-principal');
  const colorSecundario = getColor('--color-secundario');

  // Preparamos los datos para Highcharts (nombre + valor + color)
  const seriesData = data.map(d => ({
    name: d.tipo,
    y: d.cantidad,
    color: d.tipo.toLowerCase() === 'gato' ? colorPrincipal : colorSecundario
  }));

  Highcharts.chart('graficoTorta', {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Avisos por tipo'
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} avisos)'
    },
    accessibility: {
      point: { valueSuffix: '%' }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    credits: { enabled: false }, // quita el logo de Highcharts
    series: [{
      name: 'Avisos por tipo',
      colorByPoint: true,
      data: seriesData
    }]
  });
}


async function cargarGraficoBarras() { // Gráfico de barras por especie cada mes
  const res = await fetch('/api/avisos_por_mes_y_tipo');
  const data = await res.json();

  // Obtener y ordenar los meses
  const meses = Object.keys(data).map(m => parseInt(m)).sort((a, b) => a - b);
  const etiquetas = meses.map(m =>
    new Date(0, m - 1).toLocaleString('es-CL', { month: 'long' })
  );

  // Datos por tipo
  const datosPerros = meses.map(m => data[m]?.perro || 0);
  const datosGatos = meses.map(m => data[m]?.gato || 0);

  // Colores personalizados
  const colorPrincipal = getColor('--color-principal');
  const colorSecundario = getColor('--color-secundario');

  // Crear el gráfico con Highcharts
  Highcharts.chart('graficoBarras', {
    chart: {
      type: 'column',
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Avisos por mes y tipo'
    },
    xAxis: {
      categories: etiquetas,
      crosshair: true,
      title: { text: 'Mes' }
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: { text: 'Cantidad de avisos' }
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: '{series.name}: <b>{point.y}</b><br/>'
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        pointPadding: 0.1,
        groupPadding: 0.2
      }
    },
    series: [
      {
        name: 'Perros',
        data: datosPerros,
        color: colorSecundario
      },
      {
        name: 'Gatos',
        data: datosGatos,
        color: colorPrincipal
      }
    ],
    credits: { enabled: false },
    responsive: {
      rules: [{
        condition: { maxWidth: 600 },
        chartOptions: { legend: { enabled: false } }
      }]
    }
  });
}

