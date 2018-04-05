var synaptic = require('synaptic'); // this line is not needed in the browser
var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

var perceptron = new Architect.Perceptron(3,6,5)


console.log(perceptron.toJSON())
console.log(perceptron.activate([0,1,1]))