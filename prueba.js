var $ = window.jQuery
var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
var indicador= {};
indicador.id, indicador.nombre, indicador.fuente, indicador.unidad, indicador.anio, indicador.valor;
var options = {};

options = {
	chart:{
        renderTo: 'containerGraph',
        type: 'column'
    },
     credits: {
        text: 'CaliComoVamos.org.co',
		href: '#'
    },
    title: {
    	text: ''
    },
    subtitle:{
    	text: ''
    },
    xAxis: {
    	categories: '',
        title: {
            text: 'Años'
        }
    },
    yAxis: {
        title: {
        	text: ''
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
    	filename: ''
    },
    series: [{
        name: 'Cali',
        data: [],
        color: '#FEC930',
        dataLabels: {
                enabled: true       
        }
    }]
}



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

	        options.title.text = indicador.nombre;
	        options.subtitle.text = 'Código: '+indicador.id+' - Fuente: '+ indicador.fuente;
	        options.xAxis.categories = dataAnio;
	        options.yAxis.title.text = indicador.nombre;
	        options.exporting.filename = 'Gráfica '+indicador.nombre;
	        options.series[0].data = dataNumberIndicador;


			graficar();		
		};
}

function radioButton(){
	var typeChar = $('input:radio[name=optionChart]:checked').attr('id');
	var typeColor = $('input:radio[name=optionColor]:checked').attr('id');
	var typeLabel = $('input:radio[name=optionLabel]:checked').attr('id');

	if(typeChar=="TypeChart1"){
	    options.chart.type = 'column';
	}else{
		if(typeChar=="TypeChart2"){
			options.chart.type = 'bar';
		}else{
			if(typeChar=="TypeChart3"){
				options.chart.type = 'line';
			}else{
				options.chart.type = 'spline';
			}
		}
	}

	if(typeColor=="TypeColor1"){
		options.series[0].color = '#FFC902';
	}else{
		if(typeColor=="TypeColor2"){
			options.series[0].color = '#06819E';
		}else{
			if(typeColor=="TypeColor3"){
				options.series[0].color = '#EC0234';
			}else{
				options.series[0].color = '#365989';
			}
		}
	}


	if(typeLabel=="TypeLabel1"){
		options.series[0].dataLabels.enabled = true;
	}else{
		options.series[0].dataLabels.enabled = false;
	}

	graficar();

}


function graficar(){
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