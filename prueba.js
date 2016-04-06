var $ = window.jQuery
var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
var vinculoIndicadores;
var datosDiccionario={};
datosDiccionario.id, datosDiccionario.indicador, datosDiccionario.tema;
var datosIndicador={};
datosIndicador.id, datosIndicador.anio, datosIndicador.valor;

function indicador($this){
	datosIndicador.id = $this.id;
	var consultaIndicador = urlConsulta+apyKeyRecurso+'&fields=ANIO,'+datosIndicador.id;
	$.getJSON(consultaIndicador, getDatosIndicador);

		function getDatosIndicador(data){
			var datos = data.result.records;
			$.each( datos , function( i, item ) {
			 	var dato = datos[i];
			  	datosIndicador.anio = dato.ANIO;
			  	datosIndicador.valor = dato[datosIndicador.id];

			  	if(datosIndicador.valor != "NaN"){
			   		console.log("Anio: "+datosIndicador.anio+" Valor: "+datosIndicador.valor);
			  	}
			})
		};
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
			datosDiccionario.tema = dato.tema;
			datosDiccionario.id = dato.id;
			datosDiccionario.indicador = dato.Indicador;
			vinculoIndicadores = "<a onclick='indicador(this)' id='"+datosDiccionario.id+"'><i>"+datosDiccionario.indicador+"</i></a>"

			if(datosDiccionario.tema=="1. Población y Demografía"){
				$("[data-Indicador='poblacion']").append(vinculoIndicadores);
			}
			if(datosDiccionario.tema=="3. Salud"){
				$("[data-Indicador='salud']").append(vinculoIndicadores);
			}
			if(datosDiccionario.tema=="4. Educación"){
				$("[data-Indicador='educacion']").append(vinculoIndicadores);
			}
	   	 })
	};
});