var $ = window.jQuery
    //Variables de para las consultas a la API de Ciudatos.
var apyKeyDiccionario = "d2caa4c3-941b-4b9a-a168-d1206eda1bb4",
    apyKeyRecurso = "529a2e27-f0b9-4dae-a556-a445d6599d7f",
    urlConsulta = "http://datos.ciudatos.com/api/action/datastore_search?resource_id=";

var indicador = {},
    options = {},
    msgDescription,
    internalMsgError,
    errorMenssage;

indicador.id, indicador.nombre, indicador.fuente, indicador.unidad, indicador.tema, indicador.anio, indicador.valor;

options = {
    chart: {
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

function index() {
    $('.indexApp').show()
    $('.consultasApp').hide()
    $('.nav li a').removeClass('active');
    $('#index').addClass('active');

    if ($(window).width() < 768) {
        $('div.navbar-collapse').collapse('hide');
    }
}

function active(idList) {
    $('.nav li a').removeClass('active');
    $('#' + idList).addClass("active");
}

function getIndicador($id, $indicador, $fuente, $unidad, $tema) {
    $('.indexApp').hide()
    $('.consultasApp').show();

    if ($(window).width() < 768) {
        $('div.navbar-collapse').collapse('hide');
    }

    var dataIndicador = [],
        dataAnio = [],
        arrayJson = [],
        itemActual = $('.sidebar-nav').find("a.active")[0];

    if (itemActual === undefined) {
        $('#loading').hide();
    } else {
        itemActual = itemActual.id
    }

    indicador.id = $id;
    indicador.nombre = $indicador;
    indicador.fuente = $fuente;
    indicador.unidad = $unidad;
    indicador.tema = $tema;

    $('.nav li a').removeClass('active');
    //Se adiciona al nuevo item seleccionado la classe "active"
    $("#" + indicador.id).addClass("active");

    function indicador(anio, valor) {
        this.AÑO = anio;
        this.VALOR = valor;
    }

    //Valida si se ha dado click en el mismo indicador para no hacer petición de consulta.
    if (indicador.id != itemActual) {

        var consultaIndicador = urlConsulta + apyKeyRecurso + '&fields=ANIO,' + indicador.id + '&sort=ANIO';
        var JSONIndicator = $.getJSON(consultaIndicador, getDatosIndicador);

        JSONIndicator.fail(function(jqxhr) {
            internalMsgError = "<br><p><strong>Error " + jqxhr.status + "</strong><br>" + jqxhr.responseJSON.error.message + "</p>";
            $('#TecnicalMsgError').html(internalMsgError)
            $('#ModalError').modal('show');
            return
        })

        JSONIndicator.always(function() {
            $('.loading').hide();
        })

        function getDatosIndicador(data) {
            $('.loading').show();
            if (data.success != true) {
                errorMenssage = data.error.message;
                $('#TecnicalMsgError').html(errorMenssage);
                $('#ModalError').modal('show');
                return
            }
            var datos = data.result.records;
            $.each(datos, function(i, item) {
                var dato = datos[i];
                indicador.anio = dato.ANIO;
                indicador.valor = dato[indicador.id];

                if (indicador.valor != "NaN") {
                    dataIndicador.push(indicador.valor);
                    dataAnio.push(indicador.anio);
                    //Json sin valores nulos para la creación de la tabla
                    var objIndicador = new indicador(indicador.anio, indicador.valor);
                    arrayJson.push(objIndicador);
                }
            });

            var dataNumberIndicador = dataIndicador.map(Number);

            options.title.text = indicador.nombre;
            options.subtitle.text = 'Código: ' + indicador.id + ' - Fuente: ' + indicador.fuente;
            options.xAxis.categories = dataAnio;
            options.yAxis.title.text = indicador.nombre;
            options.exporting.filename = 'Gráfica ' + indicador.nombre;
            options.series[0].data = dataNumberIndicador;


            graficar();

            //Conversión de arreglo a String y luego parseado a JSON
            var jsonIndicador = JSON.parse(JSON.stringify(arrayJson));

            actualizarTabla(jsonIndicador);

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
                                                msgDescription += "Cali Cómo vamos evalua anualmente las acciones o iniciativas que nacen a partir de la comunidad ciudadana con el fin de impulsar el desarrollo local.</p>";
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

            $(".moduloDescripcion").html(msgDescription);
        };
    }








}

function graficaPersonalizada() {
    var typeChar = $('input:radio[name=optionChart]:checked').attr('id');
    var typeColor = $('input:radio[name=optionColor]:checked').attr('id');
    var typeLabel = $('input:radio[name=optionLabel]:checked').attr('id');

    if (typeChar == "TypeChart1") {
        options.chart.type = 'column';
    } else {
        if (typeChar == "TypeChart2") {
            options.chart.type = 'bar';
        } else {
            if (typeChar == "TypeChart3") {
                options.chart.type = 'line';
            } else {
                options.chart.type = 'spline';
            }
        }
    }

    if (typeColor == "TypeColor1") {
        options.series[0].color = '#FFC902';
    } else {
        if (typeColor == "TypeColor2") {
            options.series[0].color = '#06819E';
        } else {
            if (typeColor == "TypeColor3") {
                options.series[0].color = '#EC0234';
            } else {
                options.series[0].color = '#365989';
            }
        }
    }


    if (typeLabel == "TypeLabel1") {
        options.series[0].dataLabels.enabled = true;
    } else {
        options.series[0].dataLabels.enabled = false;
    }

    graficar();
}

function graficar() {
    var chart = new Highcharts.Chart(options);
}

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


function exportarDatos(typeFile) {
    var chart = $("#containerGraph").highcharts();
    chart.exportChartLocal({
        type: typeFile
    });
}

var fountSize = 14;

function aumentar() {
    fountSize++;
    document.body.style.fontSize = fountSize + "px";
}

function disminuir() {
    fountSize--;
    document.body.style.fontSize = fountSize + "px";
}

$(function() {

    var consultaDiccionario = urlConsulta + apyKeyDiccionario + "&limit=1000";
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


    $('.panelPrincipal').resize(function() { // On resize
        if ($(window).width() > 768) {
            var tamanoSide = $('.panelPrincipal').height() - 52;
            $('.sidebar').css('height', tamanoSide + 'px');
        } else {
            $('.sidebar').css('height', 'auto');
        }
    });

    $("#ventanaAyuda").on('hidden.bs.modal', function() {
        $("#ventanaAyuda iframe").attr("src", $("#ventanaAyuda iframe").attr("src"));
    });

    //Identifica pantallas táctiles - onetouchstart
    function is_touch_device() {
        return 'ontouchstart' in window // works on most browsers
    };
    //Si se No es un dispositivo táctil, se activan los popover
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