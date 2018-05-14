var dataGrafico = (function() {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "/tcc.reporthome52.json",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();







primeiros = [];
segundos = [];
terceiros = [];
quartos = [];
quintos = [];
food = [];

for (var index = 0; index < dataGrafico.length; index++) {
    primeiros.push(dataGrafico[index].firstFitness);
    segundos.push(dataGrafico[index].secondFitness);
    terceiros.push(dataGrafico[index].thirdFitness);
    quartos.push(dataGrafico[index].fourthFitness);
    quintos.push(dataGrafico[index].fifthFitness);
    food.push(dataGrafico[index].foodLeft);
    
}

var chartData = {
    type: 'line',
    plot: {
        tooltip: {
          visible: false
        },
        aspect:"spline"
    },
    "scale-x": {
        values: '0:20000:1',
        "zooming":true,
        "zoom-to":[0,10]
    },
    "scale-y": {
      values: '0:5300:100',
  },
    "scroll-x":{
        "bar":{
            "background-color":"#514d4d",
          "alpha":0.3,
          "height":20
            },
        "handle":{
            "background-color":"#514d4d"
            }
    },
    "crosshairX":{
      "line-color":"#003849",

      "scale-label":{
          "font-color":"#ffffff",
          "background-color":"#003849",
          "padding":"5px 10px 5px 10px",
          "border-radius":"5px"
      },
      "plotLabel":{
          "multiple":false,
          "callout":false,
          "shadow":false,
          "height":"115px",
          "padding":"5px 10px 5px 10px",
          "border-radius":"5px",
          "alpha":1,
      }
  },
    title: {
      text: 'Fitness por geração' // Adds a title to your chart
    },
    legend: {}, // Creates an interactive legend
    series: [  // Insert your series data here.
        { values: primeiros,
          "legend-text": "Primeiro",
          text: "Fitness do primeiro"
        },
        { values: segundos,
            "legend-text": "Segundo",
            text: "Fitness do segundo"            
        },
        { values: terceiros,
            "legend-text": "Terceiro",
            text: "Fitness do terceiro"            
        },
        { values: quartos,
            "legend-text": "Quarto",
             text: "Fitness do quarto"
        },
        { values: quintos,
            "legend-text": "Quinto",
            text: "Fitness do quinto"
        },
        { values: food,
            "legend-text": "Comida restante",
            text: "Comida restante"            
        },    
    ]
  };
  zingchart.render({ // Render Method[3]
    id: 'chartDiv',
    data: chartData,
    height: 600,
    width: 800
  });