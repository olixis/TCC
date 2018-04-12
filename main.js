var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var perceptron = new Architect.Perceptron(3,6,3)

	// create the network
    var inputLayer = new Layer(3);
    inputLayer.set({
        squash: Neuron.squash.HLIM,
    })
    var hiddenLayer = new Layer(6);
    hiddenLayer.set({
        squash: Neuron.squash.HLIM,
    })
    var outputLayer = new Layer(3);
    outputLayer.set({
        squash: Neuron.squash.HLIM,
    })
    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);
    var myNetwork = new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
    });

console.log(myNetwork.activate([0,0,0]))