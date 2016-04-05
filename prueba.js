var $ = window.jQuery
var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
var datosCali={};
datosCali.id,datosCali.indicador,datosCali.fuente;
var indicadores=[];

//var inputSearch = $("[data-input='busquedaIndicador']");
//var buttonSearch = $("[data-button='search']");
//$(button).on("click", resultadoBoton);

function indicador($this){
    var tema = $this.id;
    var consultaTema = urlConsulta+apyKeyDiccionario+'&q={"tema":"'+tema+'"}';
    $.getJSON(consultaTema, getIndicadores);
}

function getIndicadores(data){
	var datos = data.result.records;

	$.each( datos , function( i, item ) {
		var dato = datos[i];
	 	datosCali.tema = dato.tema;
		datosCali.id = dato.id;
		datosCali.indicador = dato.Indicador;
		datosCali.fuente = dato.fuente;
		indicadores.push(datosCali.indicador);
		console.log(datosCali.indicador);
		// renderTemplate();
		$("#nombreIndicador").append("<a>"+datosCali.indicador+"</a>");
   	 })
};

// function activateTemplate(id){
// 	var t = document.querySelector(id);
// 	return  document.importNode(t.content, true);
// };

// function renderTemplate(){
// 	var clone = activateTemplate("#template-indicadores");
// 	clone.querySelector("[data-indicador]").innerHTML = datosCali.indicador;
// 	$("#nombreIndicador").append(clone);
// }