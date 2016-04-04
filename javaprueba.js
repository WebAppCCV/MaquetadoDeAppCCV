(function(){
	var apyKeyDiccionario = "5a53027e-43ed-4d60-9195-1dedde259b5e";
	var apyKeyRecurso = "d3e76c49-06f3-4a66-9116-15fa4da62e25";
	var urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";
	var consulDic = urlConsulta+apyKeyDiccionario;
	var datosCali={};
	datosCali.tema,datosCali.id,datosCali.indicador,datosCali.fuente;

	$.getJSON(consulDic, getDatos);

	function getDatos(data){
		var datos = data.result.records;
		$.each( datos , function( i, item ) {
			var dato = datos[i];
		 	datosCali.tema = dato.tema;
			datosCali.id = dato.id;
			datosCali.indicador = dato.Indicador;
			datosCali.fuente = dato.fuente;
			console.log(datosCali.tema);
         });
	};

})();