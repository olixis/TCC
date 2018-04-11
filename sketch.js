var Architect = synaptic.Architect;
var Network = synaptic.Network;


function setup() {
	createCanvas(1280, 720)
	frameRate(60)
	foodList = new Array()
	population = new Array()
	deadPopulation = new Array()
	genetics = new Genetics()
	for (let index = 0; index < 40; index++) {
		foodList.push(new Food(random(width), random(height), 20, 20))
	}
	for (let index = 0; index < 5; index++) {
		population.push(new Specimen('green', 50, 3))
	}

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
	text("Fase de manutenção?: " + genetics.maintenance(), 10, 70)
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
  }

function Genetics() {
	this.pop = population
	this.foodStock = foodList
	this.generation = 0
	this.evolve = function () {
		if (this.maintenance()) {
			var fittestTwo = this.selection();
			this.mating(fittestTwo)
		}
	}
	this.mating = function (fittest) {
		var parent1DNA = fittest[0].brain.toJSON()
		var parent2DNA = fittest[1].brain.toJSON()
		var connection1Section = getRandomInt(1,parent1DNA.connections.length)
		//var neuronSection = getRandomInt(0,parent1DNA.neurons.length)
		var parent1Part = parent1DNA.connections.slice(0,connection1Section)
		var parent2Part = parent2DNA.connections.slice(connection1Section,parent2DNA.connections.length)
		console.log(parent1Part.length)
		console.log(parent2Part.length)
	}
	this.mutation = function () {}
	this.generateNewPop = function () {}
	this.selection = function () {
		var sorted = this.pop.sort(function (a, b) {
			return b.fitness - a.fitness;
		})
		return [sorted[0],sorted[1]]
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
	this.brain = new Architect.Perceptron(3, 6, 3);
	this.x = random(width);
	this.y = random(height);
	this.output = new Array();
	this.detection = new Array();
	this.belly = 100;
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
	this.saveColor = color;
	this.size = size;
	this.angle = 0;
	this.scalar = size + 20;
	this.fitness = 0;


	this.live = function () {
		//move the player
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
		stroke(this.color);
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
					//  console.log("sensor1")
					speedFix++
					this.synapse([1, 0, 0], speedFix)
				}
				if (sensor2 && !sensor1 && !sensor3) {
					speedFix++
					//  console.log("sensor2")
					this.synapse([0, 1, 0], speedFix)
				}
				if (sensor3 && !sensor1 && !sensor2) {
					speedFix++
					//  console.log("sensor3")
					this.synapse([0, 0, 1], speedFix)
				}
				if (sensor1 && sensor2) {
					speedFix++
					//  console.log("sensor1 e 2")
					this.synapse([1, 1, 0], speedFix)
				}
				if (sensor1 && sensor3) {
					speedFix++
					//  console.log("sensor1 e 3")
					this.synapse([1, 0, 1], speedFix)
				}
				if (sensor2 && sensor3) {
					speedFix++
					//  console.log("sensor2 e 3")
					this.synapse([0, 1, 1], speedFix)
				}
				if (sensor1 && sensor2 && sensor3) {
					speedFix++
					//  console.log("sensor1 2 3")
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
		// alert(this.output)
		if (this.output[0] > 0.5) {
			//up
			this.y += (Math.sin(this.angle) * this.speed) / speedFix
			this.x += (Math.cos(this.angle) * this.speed) / speedFix
		}
		if (this.output[1] > 0.5) {
			this.angle += this.swordSpeed / speedFix;
		}
		if (this.output[2] > 0.5) {
			this.angle -= this.swordSpeed / speedFix;
		}
	}

}