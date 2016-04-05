$(function() {
	var $ = window.jQuery
	var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
	var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
	var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
	var datosCali={};
	datosCali.id,datosCali.indicador,datosCali.fuente;

	//var inputSearch = $("[data-input='busquedaIndicador']");
	//var buttonSearch = $("[data-button='search']");
	//$(button).on("click", resultadoBoton);

	// function indicador($this){
	    // var tema = $this.id;
	    var consultaDiccionario = urlConsulta+apyKeyDiccionario+"&limit=1000";
	   	//var consultaDiccionario = urlConsulta+apyKeyDiccionario+'&q={"tema":"'+tema+'"}'+'&limit=3';
	    $.getJSON(consultaDiccionario, getIndicadores);


	// }

	function getIndicadores(data){
		var datos = data.result.records;
		console.log("Entree");
		$.each( datos , function( i, item ) {
			var dato = datos[i];
			datosCali.id = dato.id;
			datosCali.indicador = dato.Indicador;
			// renderTemplate();



			if(datosCali.tema=="1. Población y Demografía"){
				$("[data-indicador='poblacion']").append('<a onclick="indicador(this)" id="'+datosCali.id+'"><i>'+datosCali.indicador+'</i></a>');
	
			}
			if(datosCali.tema=="3. Salud"){
				$("[data-indicador='salud']").append('<a onclick="indicador(this)" id="'+datosCali.id+'"><i>'+datosCali.indicador+'</i></a>');
	
			}
			if(datosCali.tema=="4. Educación"){
				$("[data-indicador='educacion']").append('<a onclick="indicador(this)" id="'+datosCali.id+'"><i>'+datosCali.indicador+'</i></a>');
	
			}
			
	   	 })
	};

	function indicador($this){
		var id = $this.id;
		alert("Accion: "+id);
		//var consultaIndicador = urlConsulta+apyKeyRecurso+'&q={"id":"'+id+'"}'+'&limit=3';

	}

	// function activateTemplate(id){
	// 	var t = document.querySelector(id);
	// 	return  document.importNode(t.content, true);
	// };

	// function renderTemplate(){
	// 	var clone = activateTemplate("#template-indicadores");
	// 	clone.querySelector("[data-indicador]").innerHTML = datosCali.indicador;
	// 	$("#nombreIndicador").append(clone);
	// }
});