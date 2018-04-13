var Network = synaptic.Network;
var Layer = synaptic.Layer;
var Neuron = synaptic.Neuron;


function setup() {
	createCanvas(1280, 720)
	frameRate(60)
	foodList = new Array()
	population = new Array()
	deadPopulation = new Array()
	genetics = new Genetics()
	this.generateFood(50)
	this.initPop(5)
}

function generateFood(size) {
	for (let index = 0; index < size; index++) {
		foodList.push(new Food(random(width), random(height), 20, 20))
	}
}

function initPop(size) {
	for (let index = 0; index < size; index++) {
		population.push(new Specimen('green', 50, 3))
	}
}

function createBrain(input, hidden, output) {
	var inputLayer = new Layer(input);
	inputLayer.set({
		squash: Neuron.squash.HLIM,
	})
	var hiddenLayer = new Layer(hidden);
	hiddenLayer.set({
		squash: Neuron.squash.HLIM,
	})
	var outputLayer = new Layer(output);
	outputLayer.set({
		squash: Neuron.squash.HLIM,
	})
	inputLayer.project(hiddenLayer);
	hiddenLayer.project(outputLayer);
	return myNetwork = new Network({
		input: inputLayer,
		hidden: [hiddenLayer],
		output: outputLayer
	});
}


function draw() {
	background(255)
	foodList.forEach(food => {
		food.render()
	})
	population.forEach(specimen => {
		specimen.live()
	})
	genetics.evolve();
	this.drawStatistics()

}

function drawStatistics() {
	fill("black")
	text("FPS: " + frameRate(), 10, 10)
	text("Quantidade de indivíduos: " + population.length, 10, 25)
	text("Quantidade de comida: " + foodList.length, 10, 40)
	text("Quantidade de mortos: " + deadPopulation.length, 10, 55)
	text("Geração: " + genetics.generation, 10, 85)
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function recoverBrain(brain) {
	return Network.fromJSON(brain)
}

function Genetics() {
	this.offspringList = new Array()
	this.generation = 1

	this.evolve = function () {
		if (this.maintenance()) {
			var fittestTwo = this.selection();
			for (let index = 0; index < population.length; index++) {
				this.offspringList.push(this.mating(fittestTwo))
			}
			population = new Array();
			this.mutateOffsprings(1)
			population = this.offspringList;
			var elderGod = new Specimen('yellow', 50, 3)
			elderGod.brain = fittestTwo[0].brain
			console.log(JSON.stringify(elderGod.brain.toJSON()))
			//elderGod.brain = recoverBrain({"neurons":[{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":-0.01844041071383655,"old":-0.01844041071383655,"activation":0,"bias":-0.01844041071383655,"layer":0,"squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":-0.011254720664056486,"old":-0.011254720664056486,"activation":0,"bias":-0.011254720664056486,"layer":0,"squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":-0.004196252290733643,"old":-0.004196252290733643,"activation":0,"bias":-0.004196252290733643,"layer":0,"squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":0.05090293587883102,"old":0.05090293587883102,"activation":1,"bias":0.05090293587883102,"layer":"output","squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":0.08545440430878237,"old":0.08545440430878237,"activation":1,"bias":0.08545440430878237,"layer":"output","squash":"HLIM"},{"trace":{"elegibility":{},"extended":{}},"state":0.030751741434036084,"old":0.030751741434036084,"activation":1,"bias":0.030751741434036084,"layer":"output","squash":"HLIM"}],"connections":[{"from":0,"to":3,"weight":-0.0974004876481987,"gater":null},{"from":0,"to":4,"weight":0.05938341019152091,"gater":null},{"from":0,"to":5,"weight":0.08770373718684543,"gater":null},{"from":1,"to":3,"weight":0.06824361533909648,"gater":null},{"from":1,"to":4,"weight":-0.04678050043565887,"gater":null},{"from":1,"to":5,"weight":-0.05054667339177166,"gater":null},{"from":2,"to":3,"weight":-0.04787666303111498,"gater":null},{"from":2,"to":4,"weight":-0.03206959584673959,"gater":null},{"from":2,"to":5,"weight":0.06231609613443659,"gater":null},{"from":3,"to":6,"weight":0.048451658649525525,"gater":null},{"from":3,"to":7,"weight":0.07983157752305867,"gater":null},{"from":3,"to":8,"weight":0.007060385219618492,"gater":null},{"from":4,"to":6,"weight":-0.0316625223063451,"gater":null},{"from":4,"to":7,"weight":-0.06435876443960438,"gater":null},{"from":4,"to":8,"weight":0.045805773000450134,"gater":null},{"from":5,"to":6,"weight":-0.09048067305078784,"gater":null},{"from":5,"to":7,"weight":-0.06433505671877829,"gater":null},{"from":5,"to":8,"weight":-0.037224294341365025,"gater":null}]})
			population[0] = elderGod
			deadPopulation = new Array();
			foodList = new Array();
			generateFood(50)
			this.offspringList = new Array()
			this.generation++
		}
	}

	this.mating = function (fittest) {
		var parent1DNA = fittest[0].brain.toJSON()
		var parent2DNA = fittest[1].brain.toJSON()
		var connectionSection = getRandomInt(1, parent1DNA.connections.length)
		var neuronSection = getRandomInt(1, parent1DNA.neurons.length)
		var offspringDNA = {}

		var parent1Connections = parent1DNA.connections.slice(0, connectionSection)
		var parent2Connections = parent2DNA.connections.slice(connectionSection, parent2DNA.connections.length)

		var parent1Neurons = parent1DNA.neurons.slice(0, neuronSection)
		var parent2Neurons = parent2DNA.neurons.slice(neuronSection, parent2DNA.neurons.length)

		offspringDNA.connections = parent1Connections.concat(parent2Connections);
		offspringDNA.neurons = parent1Neurons.concat(parent2Neurons);

		var offspringBrain = Network.fromJSON(offspringDNA);
		var offspring = new Specimen('green', 50, 3);
		offspring.brain = offspringBrain;
		return offspring;
	}

	this.mutateOffsprings = function (numReplace) {
		for (let index = 0; index < numReplace; index++) {
			this.offspringList.pop()
		}
		for (let index = 0; index < numReplace; index++) {
			this.offspringList.push(new Specimen('purple', 50, 3))
		}
	}
	this.generateNewPop = function () {}
	this.selection = function () {
		var sorted = population.sort(function (a, b) {
			return b.fitness - a.fitness;
		})
		return [sorted[0], sorted[1]]
	};
	this.maintenance = function () {
		return deadPopulation.length === population.length ? true : false
	}
}




function Food(x, y, h, w) {
	this.x = x;
	this.y = y;
	this.h = h;
	this.w = w;
	this.eaten = false;
	this.render = function () {
		if (!this.eaten) {
			noStroke();
			fill("red");
			ellipse(this.x, this.y, this.h, this.w);
		} else {
			this.h = 0;
			this.w = 0;
			this.x = 9999;
			this.y = 9999;
		}
	}

}

function Specimen(color, size, speed) {
	this.brain = createBrain(3, 3, 3);
	this.x = random(width);
	this.y = random(height);
	this.output = new Array();
	this.detection = new Array();
	this.belly = 300;
	this.dead = false;
	this.sensor0X;
	this.sensor0Y;
	this.sensor45X;
	this.sensor45Y;
	this.sensor315X;
	this.sensor315Y;
	this.speed = speed;
	this.swordSpeed = 0.05;
	this.color = color;
	this.size = size;
	//this.angle = getRandomInt(0, 90);
	this.angle = 0
	this.scalar = size + 20;
	this.fitness = 0;


	this.live = function () {
		if (this.belly > 0) {
			this.drawSensors()
			this.drawBeing()
			this.detection(foodList)
			this.drawBellyAndFitness()
			this.loop();
			this.belly--;
			this.fitness++;
		} else {
			if (this.belly == 0) {
				this.dead = true;
				deadPopulation.push(this);
				this.belly--;
			}
		}
	}

	this.loop = function () {
		if (this.x < 0) {
			this.x = width;
		}
		if (this.x > width) {
			this.x = 0;
		}
		if (this.y < 0) {
			this.y = height;
		}
		if (this.y > height) {
			this.y = 0;
		}
	}

	this.drawSensors = function () {
		this.sensor0X = this.x + Math.cos(this.angle) * this.scalar;
		this.sensor0Y = this.y + Math.sin(this.angle) * this.scalar;
		strokeWeight(1);
		stroke("red");
		line(this.x, this.y, this.sensor0X, this.sensor0Y)
		this.sensor45X = this.x + Math.cos(this.angle + 0.785398) * this.scalar;
		this.sensor45Y = this.y + Math.sin(this.angle + 0.785398) * this.scalar;
		strokeWeight(1);
		stroke("blue");
		line(this.x, this.y, this.sensor45X, this.sensor45Y)
		this.sensor315X = this.x + Math.cos(this.angle - 0.785398) * this.scalar;
		this.sensor315Y = this.y + Math.sin(this.angle - 0.785398) * this.scalar;
		strokeWeight(1);
		stroke("green");
		line(this.x, this.y, this.sensor315X, this.sensor315Y)
	}

	this.drawBeing = function () {
		noStroke();
		fill(this.color);
		ellipse(this.x, this.y, this.size, this.size);
	}

	this.drawBellyAndFitness = function () {
		fill("red");
		text(this.belly, this.x - 30, this.y - 30)
		fill("blue");
		text(this.fitness, this.x + 30, this.y - 30)
	}


	this.detection = function (foodList) {
		var campoDeVisao;
		var speedFix = 1;
		for (var index = 0; index < foodList.length; index++) {
			var food = foodList[index];
			var sensor1 = collideLineCircle(this.x, this.y, this.sensor315X, this.sensor315Y, food.x, food.y, food.w);
			var sensor2 = collideLineCircle(this.x, this.y, this.sensor0X, this.sensor0Y, food.x, food.y, food.w);
			var sensor3 = collideLineCircle(this.x, this.y, this.sensor45X, this.sensor45Y, food.x, food.y, food.w);
			if (sensor1 ||
				sensor2 ||
				sensor3) {
				if (sensor1 && !sensor2 && !sensor3) {
					speedFix++
					this.synapse([1, 0, 0], speedFix)
				}
				if (sensor2 && !sensor1 && !sensor3) {
					speedFix++
					this.synapse([0, 1, 0], speedFix)
				}
				if (sensor3 && !sensor1 && !sensor2) {
					speedFix++
					this.synapse([0, 0, 1], speedFix)
				}
				if (sensor1 && sensor2) {
					speedFix++
					this.synapse([1, 1, 0], speedFix)
				}
				if (sensor1 && sensor3) {
					speedFix++
					this.synapse([1, 0, 1], speedFix)
				}
				if (sensor2 && sensor3) {
					speedFix++
					this.synapse([0, 1, 1], speedFix)
				}
				if (sensor1 && sensor2 && sensor3) {
					speedFix++
					this.synapse([1, 1, 1], speedFix)
				}
			}
			if (collideCircleCircle(this.x, this.y, this.size, food.x, food.y, food.h)) {
				food.eaten = true;
				this.belly += 100;
			}
		}
		this.synapse([0, 0, 0], speedFix)

	}

	this.synapse = function (input, speedFix) {
		this.output = this.brain.activate(input)
		if (this.output[0] == 1) {
			this.y += (Math.sin(this.angle) * this.speed) / speedFix
			this.x += (Math.cos(this.angle) * this.speed) / speedFix
		}
		if (this.output[1] == 1) {
			this.angle += this.swordSpeed / speedFix;
		}
		if (this.output[2] == 1) {
			this.angle -= this.swordSpeed / speedFix;
		}
	}

}