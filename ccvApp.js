var $ = window.jQuery
    /*** 
     *
     * Éste script hace parte de la funcionalidad lógica de la aplicación realizada para Cali Cómo Vamos.
     * La aplicación hace uso de la API de Ciudatos.com la cual dota de la información necesaria
     * para trabajar con los indicadores sociales de Santiago de Cali.
     * 
     * Author: Jesús David Padilla Cabrera
     * Version: 1.0
     ***/

/**
 * Declaración de variables globales.
 * Contiene las llaves para la conexión a la API de Ciudatos. Se usan dos repositorios diferentes, uno 
 * para la consulta del diccionario de indicadores, y otro para la data de cada indicador.
 *
 * Se definen los objetos que serán usados para la gráfica del indicador.
 *
 * Se declaran las variables usadas para mostrar algunos mensajes que debe desplegar la aplicación en caso
 * de errores de conexión con el servidor.
 */
var apyKeyDiccionario = "d2caa4c3-941b-4b9a-a168-d1206eda1bb4",
    apyKeyRecurso = "529a2e27-f0b9-4dae-a556-a445d6599d7f",
    urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=",
    indicador = {},
    options = {},
    msgDescription,
    internalMsgError,
    errorMenssage;

indicador.id, indicador.nombre, indicador.fuente, indicador.unidad, indicador.tema, indicador.anio, indicador.valor;

/**
 * Objeto que contiene la estructura y las propiedades de la gráfica de los iniciadores.
 * Se define de manera global para que pueda ser usada la misma configuración al seleccionar cualquier indicador.
 * Éste objeto solo cambia cuando el usuario decide personalizar la gráfica.
 *  
 * @type {Object}
 */
options = {
    chart: {
        renderTo: 'containerGraph',
        type: 'column',
        events: {
            load: function(event) {
                $('#loading').hide();
            }
        }
    },
    credits: {
        text: 'CaliComoVamos.org.co',
        href: '#'
    },
    title: {
        text: ''
    },
    subtitle: {
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
        filename: '',
        enabled: false
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

/**
 * Oculta los paneles HTML que muestran los resultados de los indicadores, solo dejando visible los correspondientes
 * al inicio de la aplicación.
 *
 * Si la ventana es menor a 768px, es decir versión móvil, se oculta el div que contiene el menú desplegable.
 */
function index() {
    $('.indexApp').show()
    $('.consultasApp').hide()
    $('.nav li a').removeClass('active');
    $('#index').addClass('active');

    if ($(window).width() < 768) {
        $('div.navbar-collapse').collapse('hide');
    }
}

/**
 * Remueve la clase "active" de los ítems de las listas de indicadores y la adiciona
 * al ítem que se ha presionado recientemente.
 * 
 * @param  {string} idList Identificador del ítem de la lista.
 */
function active(idList) {
    $('.nav li a').removeClass('active');
    $('#' + idList).addClass("active");
}

/**
 * Función que realiza la consulta de la información de un indicador especifico a partir del identificador suministrado.
 * 
 * @param  {String} $id        Identificador del indicador a consultar.
 * @param  {String} $indicador Nombre del indicador.
 * @param  {String} $fuente    Fuente del indicador.
 * @param  {String} $unidad    Unidad de medida que tiene los datos del indicador.
 * @param  {String} $tema      Tema al que corresponde el indicador.
 */
function getIndicador($id, $indicador, $fuente, $unidad, $tema) {
    $('.indexApp').hide() // Oculta el div HTML correspondiente al home de la aplicación.
    $('.consultasApp').show(); //Muestra los div HTML que corresponden a la consulta de indicadores.
    $('#loading').show(); //Muestra la mascara de "Cargando".

    if ($(window).width() < 768) {
        $('div.navbar-collapse').collapse('hide');
    }

    var dataIndicador = [],
        dataAnio = [],
        arrayJson = [],
        itemActual = $('.sidebar-nav').find("a.active")[0];

    if (itemActual !== undefined) {
        $('#loading').hide(); //Si se realizo una consulta por la barra de búsqueda, no hay ítem de lista activo entonces se oculta la mascara de "Cargando"
    } else {
        itemActual = itemActual.id
    }

    indicador.id = $id;
    indicador.nombre = $indicador;
    indicador.fuente = $fuente;
    indicador.unidad = $unidad;
    indicador.tema = $tema;

    $('.nav li a').removeClass('active');
    //Se adiciona al nuevo ítem seleccionado la clase "active"
    $("#" + indicador.id).addClass("active");

    function indicador(anio, valor) {
        this.AÑO = anio;
        this.VALOR = valor;
    }

    //Valida si se ha dado clic en el mismo indicador para no hacer la misma consulta del indicador.
    if (indicador.id != itemActual) {

        //Se construye la variable con la url correspondiente a la consulta especifica de la API.
        var consultaIndicador = urlConsulta + apyKeyRecurso + '&fields=ANIO,' + indicador.id + '&sort=ANIO';
        var JSONIndicator = $.getJSON(consultaIndicador, getDatosIndicador);

        //Si en la consulta se produce algún error, se muestra al usuario el mensaje correspondiente.
        JSONIndicator.fail(function(jqxhr) {
            internalMsgError = "<br><p><strong>Error " + jqxhr.status + "</strong><br>" + jqxhr.responseJSON.error.message + "</p>";
            $('#TecnicalMsgError').html(internalMsgError)
            $('#ModalError').modal('show');
            return
        })

        /**
         * Función Callback de la petición de la API.
         * Contiene toda la data de la consulta, la cual es procesada  mostrada al usuario a manera de mensajes,
         * gráficas y tablas de datos.
         * 
         * @param  {object} data objeto JSON con la respuesta de la API.
         */
        function getDatosIndicador(data) {
            if (data.success != true) {
                errorMenssage = data.error.message;
                $('#TecnicalMsgError').html(errorMenssage);
                $('#ModalError').modal('show');
                return
            }
            var datos = data.result.records;
            //Se recorre la data y los valores de los años y el valor del indicador son adicionados
            //a arreglos correspondientes.
            $.each(datos, function(i, item) {
                var dato = datos[i];
                indicador.anio = dato.ANIO;
                indicador.valor = dato[indicador.id];

                if (indicador.valor != "NaN") {
                    var indicatorValue = Number(indicador.valor);
                    if(indicatorValue % 1 != 0 && Math.floor(indicatorValue) == 0){
                        indicatorValue = indicatorValue * 100;
                    }
                    indicatorValue = Number(indicatorValue.toFixed(2));
                    dataIndicador.push(indicatorValue);
                    dataAnio.push(indicador.anio);
                    //Json sin valores nulos para la creación de la tabla
                    var objIndicador = new indicador(indicador.anio, indicador.valor);
                    arrayJson.push(objIndicador);
                }
            });

            var dataNumberIndicador = dataIndicador;

            //var dataNumberIndicador = dataIndicador.map(Number);

            //Se modifica el objeto global con la configuración que usará la gráfica del indicador.
            options.title.text = indicador.nombre;
            options.subtitle.text = 'Código: ' + indicador.id + ' - Fuente: ' + indicador.fuente;
            options.xAxis.categories = dataAnio;
            options.yAxis.title.text = indicador.nombre;
            options.exporting.filename = 'Gráfica ' + indicador.nombre;
            options.series[0].data = dataNumberIndicador;

            //Se gráfica el indicador.
            graficar();

            //Conversión de arreglo a String y luego parseado a JSON
            var jsonIndicador = JSON.parse(JSON.stringify(arrayJson));

            //Se envian los valores del indicador a la tabla de datos.
            actualizarTabla(jsonIndicador);

            //Se configura el mensaje que será usado en el apartado de "Módilo de descripción" del indicador seleccionado.
            msgDescription = "<p><strong>Nombre del indicador:</strong> " + indicador.nombre + "</p><p><strong>Fuente:</strong> " + indicador.fuente + "</p><p><strong>Tema:</strong> " + indicador.tema + "</p>";

            msgDescription += "<p><strong>Contexto: </strong>"
            if (indicador.tema == "1. Población y Demografía") {
                msgDescription += "Cali Cómo Vamos monitorea anualmente los indicadores que conciernen a la información demográfica de la ciudad, brindando un reporte objetivo de las variaciones poblacionales.</p>";
            } else {
                if (indicador.tema == "2. Pobreza y desigualdad") {
                    msgDescription += "Cali Cómo Vamos monitorea las principales variables y acciones que dan cuenta de la intervención a grupos poblacionales vulnerables, lo que es fundamental para lograr la equidad social.</p>";
                } else {
                    if (indicador.tema == "4. Educación") {
                        msgDescription += "Este capítulo evalúa el comportamiento de la Educación Inicial Básica, Media y Superior a través de indicadores de cobertura y calidad en Cali.</p>";
                    } else {
                        if (indicador.tema == "6. Seguridad ciudadana") {
                            msgDescription += "El programa Cali Cómo Vamos evalúa los cambios en la seguridad y convivencia de la ciudad, en función de las estadísticas de homicidios, muertes violentas, delitos de alto impacto, las denuncias por maltrato infantil, así como a través de los resultados de las principales estrategias de la Administración y la Policía en materia de seguridad y convivencia ciudadana.</p>";
                        } else {
                            if (indicador.tema == "8. Medio ambiente") {
                                msgDescription += "Cali Cómo Vamos monitorea anualmente el Ambiente de la ciudad en sus principales componentes: aire, agua, ruido, árboles, zonas verdes y zonas de protección.</p>";
                            } else {
                                if (indicador.tema == "11. Cultura, turismo, recreación y deporte") {
                                    msgDescription += "La actividad cultural permite expandir el imaginario de las personas, explorar su potencial intelectual y artístico, así como puede contribuir a mejorar la convivencia. Es por ello que CCV monitorea indicadores de realización de eventos y programas que la promuevan.</p>";
                                } else {
                                    if (indicador.tema == "3. Salud") {
                                        msgDescription += "Cali Cómo Vamos evalúa los cambios en la salud de los caleños, en función de indicadores de cobertura, mortalidad específica y calidad de los servicios médicos y de la salud pública en general.</p>";
                                    } else {
                                        if (indicador.tema == "9. Movilidad") {
                                            msgDescription += "Este apartado se concentra en los principales componentes del tránsito vial, parque automotor, control, accidentalidad y en el principal proyecto de transporte de la ciudad, el Sistema Integrado de Transporte Masivo, MIO.</p>";
                                        } else {
                                            if (indicador.tema == "12. Participación y cultura ciudadana") {
                                                msgDescription += "Cali Cómo vamos evaluá anualmente las acciones o iniciativas que nacen a partir de la comunidad ciudadana con el fin de impulsar el desarrollo local.</p>";
                                            } else {
                                                if (indicador.tema == "10. Espacio público") {
                                                    msgDescription += "La disponibilidad de Espacio Público de calidad es componente fundamental del Hábitat, al igual que la Vivienda y su entorno. Por ello, CCV le hace seguimiento desde la tasa de espacio público efectivo por habitante, los estándares internacionales y las obras para mejorarlo en cantidad y calidad para los caleños.</p>";
                                                } else {
                                                    if (indicador.tema == "7. Vivienda y Servicios públicos") {
                                                        msgDescription += "La evaluación sobre la tenencia de vivienda digna por parte de los caleños, es abordada desde indicadores de déficit habitacional cuantitativo y cualitativo, además de los resultados de las estrategias de reducción de sus principales componentes.</p>";
                                                    } else {
                                                        if (indicador.tema == "5. Mercado laboral (Empleo)") {
                                                            msgDescription += "La generación de empleo y empresa genera los ingresos que constituyen el sustento principal de las personas y las familias para garantizar su acceso a los bienes y servicios que satisfacen sus necesidades básicas.</p>";
                                                        } else {
                                                            if (indicador.tema == "13. Finanzas y gestión pública") {
                                                                msgDescription += "Este capítulo brinda un panorama general de las finanzas del municipio, haciendo seguimiento anual a sus ingresos, gastos, inversión y deuda. Una hacienda municipal sólida, sostenible y amplia representa flujo continuo de recursos para la inversión social de los caleños.</p>";
                                                            } else {
                                                                if (indicador.tema == "14. Entorno económico") {
                                                                    msgDescription += "La generación de empleo y empresa genera los ingresos que constituyen el sustento principal de las personas y las familias para garantizar su acceso a los bienes y servicios que satisfacen sus necesidades básicas.</p>";
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //Se agrega al DOM, el mensaje configurado según la respuesta del servidor.
            $(".moduloDescripcion").html(msgDescription);
        };
    }
}

/**
 * Permite la personalización de la gráfica por parte del usuario.
 * Define la configuración de la etiqueda de datos en el gráfico.
 */
function personalizarLabelGrafica(TypeLabel) {

    if (TypeLabel == "TypeLabel1") {
        options.series[0].dataLabels.enabled = true;
        $('#TypeLabel1, #TypeLabelMobile1').addClass("active");
        $('#TypeLabel2, #TypeLabelMobile2').removeClass("active");
    } else {
        options.series[0].dataLabels.enabled = false;
        $('#TypeLabel1, #TypeLabelMobile1').removeClass("active");
        $('#TypeLabel2, #TypeLabelMobile2').addClass("active");
    }
    graficar();
}

/**
 * Permite la personalización de la gráfica por parte del usuario.
 * Define la configuración del tipo de gráfica (Columna, Barra, Linea, Curva).
 */
function personalizarTipoGrafica(TypeGraph) {

    if (TypeGraph == "TypeChart1") {
        options.chart.type = 'column';
        $('#TypeChart1, #TypeChartMobile1').addClass("active");
        $('#TypeChart2, #TypeChart3, #TypeChart4, #TypeChartMobile2, #TypeChartMobile3, #TypeChartMobile4').removeClass("active");

    } else if (TypeGraph == "TypeChart2") {
        options.chart.type = 'bar';
        $('#TypeChart2, #TypeChartMobile2').addClass("active");
        $('#TypeChart1, #TypeChart3, #TypeChart4, #TypeChartMobile1, #TypeChartMobile3, #TypeChartMobile4').removeClass("active");

    } else if (TypeGraph == "TypeChart3") {
        options.chart.type = 'line';
        $('#TypeChart3, #TypeChartMobile3').addClass("active");
        $('#TypeChart1, #TypeChart2, #TypeChart4, #TypeChartMobile1, #TypeChartMobile2, #TypeChartMobile4').removeClass("active");

    } else if (TypeGraph == "TypeChart4") {
        options.chart.type = 'spline';
        $('#TypeChart4, #TypeChartMobile4').addClass("active");
        $('#TypeChart1, #TypeChart2, #TypeChart3, #TypeChartMobile1, #TypeChartMobile2, #TypeChartMobile3').removeClass("active");
    }
    graficar();
}

/**
 * Permite la personalización de la gráfica por parte del usuario.
 * Define la configuración del color de la gráfica.
 */
function personalizarColorGrafica(ColorGraph) {

    if (ColorGraph == "TypeColor1") {
        options.series[0].color = '#FFC902';
        $('#TypeColor1, #TypeColorMobile1').addClass("active");
        $('#TypeColor2, #TypeColor3, #TypeColor4, #TypeColorMobile2, #TypeColorMobile3, #TypeColorMobile4').removeClass("active");

    } else if (ColorGraph == "TypeColor2") {
        options.series[0].color = '#06819E';
        $('#TypeColor2, #TypeColorMobile2').addClass("active");
        $('#TypeColor1, #TypeColor3, #TypeColor4, #TypeColorMobile1, #TypeColorMobile3, #TypeColorMobile4').removeClass("active");

    } else if (ColorGraph == "TypeColor3") {
        options.series[0].color = '#EC0234';
        $('#TypeColor3, #TypeColorMobile3').addClass("active");
        $('#TypeColor1, #TypeColor2, #TypeColor4, #TypeColorMobile1, #TypeColorMobile2, #TypeColorMobile4').removeClass("active");

    } else if (ColorGraph == "TypeColor4") {
        options.series[0].color = '#365989';
        $('#TypeColor4, #TypeColorMobile4').addClass("active");
        $('#TypeColor1, #TypeColor2, #TypeColor3, #TypeColorMobile1, #TypeColorMobile2, #TypeColorMobile3').removeClass("active");
    }
    graficar();
}

/**
 * Realiza el llamado de la librería Highcharts quien se encarga de construir la gráfica del indicador.
 * Se envia como parámetro el objeto "options" quien tiene la confirmación que se desea para la gráfica. 
 */
function graficar() {

    if ($(window).width() < 768) {
        $('body,html').animate({ scrollTop: 0 }, 500);
    }

    var chart = new Highcharts.Chart(options);
}

/**
 * Se consutruye la tabla de datos a partir del JSON de datos del indicador consultado.
 * La tabla de datos se agrega al DOM del módulo "Interacción" en el apartado de "tabla de datos" de la aplicación.
 *  
 * @param  {object} jsonIndicador Datos de año, y valor del indicador consultado.
 */
function actualizarTabla(jsonIndicador) {

    //Comprueba si el div de la tabla tiene contenido, si es así destruye la tabla
    if ($('#tablaDatosDesktop').html() !== "" | $('#tablaDatosMobile').html() !== "") {
        $('#tablaDatosDesktop').columns('destroy');
        $('#tablaDatosMobile').columns('destroy');
    }

    //Crea la tabla de la consulta correspondiente
    $('#tablaDatosDesktop').columns({
        data: jsonIndicador,
        showRows: [5, 10]
    });

    //Crea la tabla de la consulta correspondiente
    $('#tablaDatosMobile').columns({
        data: jsonIndicador,
        showRows: [5, 10, 20],
    });
}

/**
 * Se encarga de realizar la consulta a la API a partir del texto escrito por el usuario en la barra de búsqueda.
 */
function searchIndicador() {
    var indicadorSeleccionado = $("#search_indicadores").val();
    var consultaDiccionario = urlConsulta + apyKeyDiccionario + '&filters={"Indicador":"' + indicadorSeleccionado + '"}';
    var JSONTemas = $.getJSON(consultaDiccionario, getNombreIndicadores);

    JSONTemas.fail(function(jqxhr) {
        internalMsgError = "<br><p><strong>Error " + jqxhr.status + "</strong><br>" + jqxhr.responseJSON.error.message + "</p>";
        $('#TecnicalMsgError').html(internalMsgError);
        $('#ModalError').modal('show');
        return
    })

    JSONTemas.always(function() {
        $('#loading').hide();
    })

    function getNombreIndicadores(data) {
        $('#loading').show();
        if (data.success != true) {
            errorMenssage = data.error.message;
            $('#TecnicalMsgError').html(errorMenssage);
            $('#ModalError').modal('show');
            return
        }
        var datos = data.result.records[0];
        if (datos !== undefined) {
            getIndicador(datos.id, datos.Indicador, datos.fuente, datos.unidad, datos.tema);
        } else {
            $('#loading').hide();
            $('#ModalNoResults').modal('show');
        }
    };
}

/**
 * Función que permite exportar los datos del gráfico en diferentes tipos de formato.
 * 
 * @param  {String} typeFile Formato en el cual se exportarán los datos.
 */
function exportarDatos(typeFile) {
    var chart = $("#containerGraph").highcharts();
    chart.exportChartLocal({
        type: typeFile
    });
}

// Tamaño general de la fuente de la aplicación.
var fountSize = 14;

/**
 * Función que permite aumentar el tamaño de la fuente de la aplicación.
 */
function aumentar() {
    fountSize++;
    document.body.style.fontSize = fountSize + "px";
}

/**
 * Función que permite disminuir el tamaño de la fuente de la aplicación.
 */
function disminuir() {
    fountSize--;
    document.body.style.fontSize = fountSize + "px";
}

// Bloque de código que se ejecutará una vez esté listo el documento HTML.
$(function() {

    /**
     * Declaración de variables que construirán la consulta del diccionario de los indicadores.
     * @type {String}
     */
    var consultaDiccionario = urlConsulta + apyKeyDiccionario + "&limit=1000";
    var JSONTemas = $.getJSON(consultaDiccionario, getNombreIndicadores);

    JSONTemas.fail(function(jqxhr) {
        console.log("Error de carga")
        internalMsgError = "<br><p><strong>Error " + jqxhr.status + "</strong><br>" + jqxhr.responseJSON.error.message + "</p>";
        $('#TecnicalMsgError').html(internalMsgError);
        $('#ModalError').modal('show');
        return
    })

    JSONTemas.always(function() {
        $('#loading').hide();
    })
    
    /**
     * Función Callback de la petición de la API. Contiene la data del diccionario de los indicadores.
     * 
     * @param  {object} data Información del diccionario de los indicadores.
     */
    function getNombreIndicadores(data) {
        $('#loading').show();
        if (data.success != true) {
            errorMenssage = data.error.message;
            $('#TecnicalMsgError').html(errorMenssage);
            $('#ModalError').modal('show');
            return
        }

        var datos = data.result.records;
        var options = {
            data: datos,
            getValue: "Indicador",
            list: {
                match: {
                    enabled: true
                },
                maxNumberOfElements: 10,
                onClickEvent: function() {
                    searchIndicador();
                },
                showAnimation: {
                    type: "slide",
                    time: 300,
                    callback: function() {}
                },

                hideAnimation: {
                    type: "slide",
                    time: 300,
                    callback: function() {}
                }
            }
        };

        $("#search_indicadores").easyAutocomplete(options);
        $('.easy-autocomplete').css('width', '100%');

        //Se recorre el tamaño de la data obtenida, y dependiendo del tema del indicador se construye los subitems del menú (módulo de indicadores) con los indicadores correspondientes.
        $.each(datos, function(i, item) {
            var dato = datos[i];
            var vinculoIndicadores = '<a onclick="getIndicador(\'' + dato.id + '\',\'' + dato.Indicador + '\',\'' + dato.fuente + '\',\'' + dato.unidad + '\',\'' + dato.tema + '\')" id=' + dato.id + '><i>' + dato.Indicador + '</i></a>'

            if (dato.tema == "1. Población y Demografía") {
                $("[data-Indicador='poblacion']").append(vinculoIndicadores);
            }
            if (dato.tema == "2. Pobreza y desigualdad") {
                $("[data-Indicador='pobreza']").append(vinculoIndicadores);
            }
            if (dato.tema == "4. Educación") {
                $("[data-Indicador='educacion']").append(vinculoIndicadores);
            }
            if (dato.tema == "6. Seguridad ciudadana") {
                $("[data-Indicador='seguridad']").append(vinculoIndicadores);
            }
            if (dato.tema == "8. Medio ambiente") {
                $("[data-Indicador='ambiente']").append(vinculoIndicadores);
            }
            if (dato.tema == "11. Cultura, turismo, recreación y deporte") {
                $("[data-Indicador='cultura']").append(vinculoIndicadores);
            }
            if (dato.tema == "3. Salud") {
                $("[data-Indicador='salud']").append(vinculoIndicadores);
            }
            if (dato.tema == "9. Movilidad") {
                $("[data-Indicador='movilidad']").append(vinculoIndicadores);
            }
            if (dato.tema == "12. Participación y cultura ciudadana") {
                $("[data-Indicador='participacion']").append(vinculoIndicadores);
            }
            if (dato.tema == "10. Espacio público") {
                $("[data-Indicador='espacio']").append(vinculoIndicadores);
            }
            if (dato.tema == "7. Vivienda y Servicios públicos") {
                $("[data-Indicador='vivienda']").append(vinculoIndicadores);
            }
            if (dato.tema == "5. Mercado laboral (Empleo)") {
                $("[data-Indicador='empleo']").append(vinculoIndicadores);
            }
            if (dato.tema == "13. Finanzas y gestión pública") {
                $("[data-Indicador='finanzas']").append(vinculoIndicadores);
            }
            if (dato.tema == "14. Entorno económico") {
                $("[data-Indicador='economia']").append(vinculoIndicadores);
            }
        })
    };

    //Se escucha el evento resize del div "Panel principal" para limitar la altura del div que contiene los indicadores para que éste no se desborde
    //de los limites del contenedor padre.
    //
    $('.panelPrincipal').resize(function() { // On resize
        if ($(window).width() > 768) {
            var tamanoSide = $('.panelPrincipal').height() - 52;
            $('.sidebar').css('height', tamanoSide + 'px');
        } else {
            $('.sidebar').css('height', 'auto');
        }
    });

    //Se escucha el evento On de la ventana emergente correspondiente al apartado de Ayuda de la aplicación. En ésta está contenido un video tutorial de cómo se usa la plataforma.
    $("#ventanaAyuda").on('hidden.bs.modal', function() {
        $("#ventanaAyuda iframe").attr("src", $("#ventanaAyuda iframe").attr("src"));
    });

    //Identifica pantallas táctiles - onetouchstart
    function is_touch_device() {
        return 'ontouchstart' in window // Trabaja en la mayoría de los navegadores.
    };

    //Si se No es un dispositivo táctil, se activan los popover (Ayuda contextual).
    if (!is_touch_device()) {
        $('[rel="popover"]').popover({
            trigger: 'hover',
            html: true,
            delay: {
                'show': 800,
                'hide': 100
            }
        });
    }
});