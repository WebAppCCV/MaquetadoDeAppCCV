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
	for(var i in datos){
		var dato = datos[i];
		datosCali.id = dato.id;
		datosCali.indicador = dato.Indicador;
		datosCali.fuente = dato.fuente;
		indicadores.push(datosCali.indicador);

		$('.indicadores').each(function( i, item ) {
		var dato = datos[i];
		var $this = $(item);

		var $nameIndicador = $this.find('.nombreIndicador');
		datosCali.indicador = dato.Indicador;
		$nameIndicador.text(datosCali.indicador);

	 })

	}



	console.log(datos);
}

function activateTemplate(id){
	var t = document.querySelector(id);
	return  document.importNode(t.content, true);
};

function renderTemplate(){
	var clone = activateTemplate("#template-indicadores");
	clone.querySelector("[data-indicador]").innerHTML = ;
}