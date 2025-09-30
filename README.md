# Tarea 1
Uso de HTML5 Y CSS3
## Desiciones tomadas TAREA 2

Para el correcto funcionamiento, se deben instalar las versiones señaladas en el archivo requirements.txt

### Desiciones de almacenamiento.

En la carpeta static hay dos carpetas para imagenes:
* **img** que guarda las imagenes de la página como header, la imagen del comienzo y los graficos para estadisticas
* **uploads** que almacena todas las imagenes subidas a tráves del formulario.

### Desiciones funcionales

* Debido al uso de jinja, se decidio dejar la funcioanlidad para el cambio de color de la fila al ser seleccionada en el mismo HTML.
* El archivo zoomImg.js paso a llamarse detalles.js. En este archivo esta lo necesario para el zoom de las imágenes y lo neceario para los botones de retroceder e inicio al final de la información del aviso.
* La paginación se hizo en el archivo app.py, manualmente pues se tomo como base el auxiliar 5 donde se usa "Base = declarative_base()"
* Se tienen varias funciones bd.py que no son usadas en esta tarea, pero se espera usarlas en la siguiente entrega.

## Desiciones tomadas TAREA 1

### Para la validación se realizo lo siguiente:
* Si al enviar el formulario alguno o varios de los campos obligatorios estan vacíos, no se deja enviar el formulario y se regresa a este. Se mantienen los datos llenados y se marcan en rojo los campos que faltaron por llenar o por agregar (archivo) mostrando un mensaje explicando el error.
* Si alguno de los datos con limitaciones en la cantidad de caracteres, sobrepasa o no alcanza ese limite el contenedor se torna rojo, se dejan de aceptar caracteres y apareece un mensaje en rojo explicando porque es un error.
* Si alguno de los datos numericos no cumple con los limites de valor maximo o minimo, el contenedor se vuelve rojo y aparece un mensaje explicando porque hay un error.
* La fecha y hora se autocompleta con el día actual y la hora actual más tres horas.

### Funcionalidades:
* Para el zoom de las imágenes se creo un modal que se abre al presionar la imágen mostrandola en el tamaño aumnetado (800X600 píxeles). Este se cerrara al presionar la X en la esquina superior derecha.
* Al enviar el formulario se valida todo lo especificado una vez se presiona el botón "si, estoy seguro". Si no se pasa la validación, aparece un mensaje en rojo en la parte superior, por el contrario, si todo esta bien sale un mensaje verde de confimación. 

### Diposición de elementos:
* Se creo un menu superior con todas las secciones solicitas (inicio, Agregar aviso de apodción, Ver avisos, Estadísticas).
* Hay un header con una imagen y un nombre para la página web.
* Los avisos mostrados en la portada o inicio solo muestra una de las imágenes.
* En Ver avisos se muestra Fecha de Publicación, Fecha de entrega, Comuna, sector, Cantidad, Tipo y Edad Nombre Contacto y todas las imágenes en pequeño.
* En el detalle completo de cada aviso hay un botón para regresar sobre la información, que esta en la parte izquierda de la pantalla. Las imágenes se muestran en una columna al lado derecho de la pantalla.
* En Estadísticas se dejaron los dos gráficos más generales (Adopciones por Especie y Cantidad de avisos por especie cada mes) arriba, uno al lado del otro, con un titulo en naranjo. Mientras que el gráfico de Avisos por día se dejo en una segunda fila de mayor tamaño. Finalmente esta el botón para retroceder debajo del gráfico Avisos por día.

### Desiciones de diseño
* Se eligio el rosado como base y el naranjo como color secundario (es posible que se cambien en futuras entregas).
* Todos los titulos son rosado fuerte y los subtitulos son naranjos.
* Todos los botones son rosado claro y al colocar el cursor sobre ellos se tornan rosado fuerte. La barra de navegación se dejo con tonos diferentes de rosado claro, se torna ligeramente más fuerte al pasar el cursor sobre los botones.
* Las filas en ver avisos se tornan naranjo suave al pasar el cursor sobre ellas. Se hizo para saber que efectivamente se esta seleccionando una fila y saber exactamente cual es.
* Todos los campos del formulario tienen la palabra "obligatorio" u "opcional" al costado derecho. Este texto es de color gris, esta en cursiva y tiene una fuente más pequeño que la etiqueta del campo. 
* Todos los campos del formulario que tiene limites de caracteres lo especifica en la casilla del input. Lo mismos para los datos numéricos, donde se dice el valor mínimo.