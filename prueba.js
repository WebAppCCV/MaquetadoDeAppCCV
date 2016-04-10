var $ = window.jQuery
var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
var indicador= {};
indicador.id, indicador.nombre, indicador.fuente, indicador.unidad, indicador.anio, indicador.valor;
var options = {};



function getIndicador($id, $indicador, $fuente, $unidad){
	var dataIndicador = [];
	var dataAnio = [];
	indicador.id = $id;
	indicador.nombre = $indicador;
	indicador.fuente = $fuente;
	indicador.unidad = $unidad;
	var consultaIndicador = urlConsulta+apyKeyRecurso+'&fields=ANIO,'+indicador.id+'&sort=ANIO';

	$.getJSON(consultaIndicador, getDatosIndicador);

		function getDatosIndicador(data){
			var datos = data.result.records;
			$.each( datos , function( i, item ) {
			 	var dato = datos[i];
			  	indicador.anio = dato.ANIO;
			  	indicador.valor = dato[indicador.id];

			  	if(indicador.valor != "NaN"){
			   		dataIndicador.push(indicador.valor);
			   		dataAnio.push(indicador.anio);
			  	}
			});

			var dataNumberIndicador = dataIndicador.map(Number);

			options = {

				chart:{
		            //Tipos: line, spline, bar, column
		            renderTo: 'containerGraph',
		            type: 'column'
		        },
		         credits: {
		            text: 'CaliComoVamos.org.co',
            		href: '#'
		        },
		        title: {
		            text: indicador.nombre
		        },
		        subtitle:{
		            text: 'Código: '+indicador.id+' - Fuente: '+ indicador.fuente
		        },
		        xAxis: {
		            categories: dataAnio,
		            title: {
		                text: 'Años'
		            }
		        },
		        yAxis: {
		            title: {
		                text: indicador.unidad
		            }
		        },
		        tooltip: {
		            crosshairs: true,
		            shared: true,
		            valueDecimals: 2
		        },
		        
		        legend: {
		            layout: 'horizontal',
		            verticalAlign: 'bottom',
		            align: 'center'
		        },
		        exporting: {
		            filename: 'Gráfica '+indicador.nombre
		        },
		        series: [{
		            name: 'Cali',
		            data: dataNumberIndicador,
		            color: '#FEC930',
		            dataLabels: {
		                    enabled: true       
		            }
		        }]

			}

			graficar();		
		};
}



function graficar(){
	//Cosas para variar:
	//Tipo de gráfica, Series: Color, quitar DataLables
	var chart = new Highcharts.Chart(options);
}


$(function() {
	//var inputSearch = $("[data-input='busquedaIndicador']");
	//var buttonSearch = $("[data-button='search']");
	//$(button).on("click", resultadoBoton);


	//var consultaDiccionario = urlConsulta+apyKeyDiccionario+'&q={"tema":"'+tema+'"}'+'&limit=3';
	var consultaDiccionario = urlConsulta+apyKeyDiccionario+"&limit=1000";
	$.getJSON(consultaDiccionario, getNombreIndicadores);

	function getNombreIndicadores(data){
		var datos = data.result.records;
		$.each( datos , function( i, item ) {
			var dato = datos[i];
			var vinculoIndicadores = '<a onclick="getIndicador(\''+dato.id+'\',\''+dato.Indicador+'\',\''+dato.fuente+'\',\''+dato.unidad+'\')"><i>'+dato.Indicador+'</i></a>'

			if(dato.tema=="1. Población y Demografía"){
				$("[data-Indicador='poblacion']").append(vinculoIndicadores);
			}
			if(dato.tema=="3. Salud"){
				$("[data-Indicador='salud']").append(vinculoIndicadores);
			}
			if(dato.tema=="4. Educación"){
				$("[data-Indicador='educacion']").append(vinculoIndicadores);
			}
	   	 })
	};
});