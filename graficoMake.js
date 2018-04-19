primeiros = [];
segundos = [];

for (var index = 0; index < dataGrafico.length; index++) {
    primeiros.push(dataGrafico[index].generationBest[0].best1Fitness);
    segundos.push(dataGrafico[index].generationBest[1].best2Fitness);
    
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
        values: '0:6000:1',
        //"zooming":true,
        //"zoom-to":[0,10]
    },
    "scale-y": {
      values: '300:5300:100',
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
      "lineWidth":1,
      "line-color":"#003849",
      "marker":{
          "size":4,
          "type":"circle",
          "borderColor":"#fff",
          "borderWidth":1
      },
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
          "headerText":"Node %scale-key-text<br>",
          "text":"Geração %kt Fitness %vt"
      }
  },
    title: {
      text: 'Fitness por geração' // Adds a title to your chart
    },
    legend: {}, // Creates an interactive legend
    series: [  // Insert your series data here.
        { values: primeiros,
          text: "Melhor Espécime"
        },
        { values: segundos,
          text: "Segunda Melhor Espécime"
        }  
    ]
  };
  zingchart.render({ // Render Method[3]
    id: 'chartDiv',
    data: chartData,
    height: 720,
    width: "100%"
  });