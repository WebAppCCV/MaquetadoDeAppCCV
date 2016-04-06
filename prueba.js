var $ = window.jQuery
var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
var vinculoIndicadores;
var datosCali={};
datosCali.id,datosCali.indicador,datosCali.tema;

function indicador($this){
	var id = $this.id;
	console.log(id);
	var consultaIndicador = urlConsulta+apyKeyRecurso+'&fields=ANIO,'+id;
	$.getJSON(consultaIndicador, getDatosIndicador);
}

function getDatosIndicador(data){
	var datos = data.result.records;
	console.log(datos);
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
			datosCali.tema = dato.tema;
			datosCali.id = dato.id;
			datosCali.indicador = dato.Indicador;
			vinculoIndicadores = "<a onclick='indicador(this)' id='"+datosCali.id+"'><i>"+datosCali.indicador+"</i></a>"

			if(datosCali.tema=="1. Población y Demografía"){
				$("[data-Indicador='poblacion']").append(vinculoIndicadores);
			}
			if(datosCali.tema=="3. Salud"){
				$("[data-Indicador='salud']").append(vinculoIndicadores);
			}
			if(datosCali.tema=="4. Educación"){
				$("[data-Indicador='educacion']").append(vinculoIndicadores);
			}
	   	 })
	};
});