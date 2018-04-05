var Architect = synaptic.Architect;


function setup() {
	createCanvas(1280, 720);
	foodList = new Array()
	populacao = new Array()
	for (let index = 0; index < 50; index++) {
		foodList.push(new Food(random(width), random(height), 20, 20))
	}
	for (let index = 0; index < 5; index++) {
		populacao.push(new playerObj('green', 50, 3))
	}

}

function draw() {
	background(255);
	foodList.forEach(food => {
		food.render()
	});
	populacao.forEach(p => {
		p.live()
	});
}


function Genetics(){
	this.population;
	this.foodStock;
	this.diferentiation;
	this.mutation;
	this.selection;
}




function Food(x, y, h, w) {
	this.x = x;
	this.y = y;
	this.h = h;
	this.w = w;
	this.eaten = false;
	this.render = function () {
		if(!this.eaten){
			noStroke();
			fill("red");
			ellipse(this.x, this.y, this.h, this.w);
		}else{
			this.h = 0;
			this.w = 0;
			this.x = 9999;
			this.y = 9999;
		}
	}

}

function playerObj(color, size, speed) {
	this.brain = new Architect.Perceptron(3, 6, 3);
	this.x = random(width);
	this.y = random(height);
	this.output = new Array();
	this.detection = new Array();
	this.belly = 1000;
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
		if(this.belly > 0 ){
		this.drawSensors()
		this.drawBeing()
		this.detection(foodList)
		this.drawBellyAndFitness()
		this.belly--;
		this.fitness++;
		
		//loop around the edges
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
	}else{
		this.dead = true;
	}
		
		
	}

	this.drawSensors = function () {
		this.sensor0X = this.x + cos(this.angle) * this.scalar;
		this.sensor0Y = this.y + sin(this.angle) * this.scalar;
		strokeWeight(1);
		stroke("red");
		line(this.x, this.y, this.sensor0X, this.sensor0Y)
		this.sensor45X = this.x + cos(this.angle + 0.785398) * this.scalar;
		this.sensor45Y = this.y + sin(this.angle + 0.785398) * this.scalar;
		strokeWeight(1);
		stroke("blue");
		line(this.x, this.y, this.sensor45X, this.sensor45Y)
		this.sensor315X = this.x + cos(this.angle - 0.785398) * this.scalar;
		this.sensor315Y = this.y + sin(this.angle - 0.785398) * this.scalar;
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

	this.collide = function (population, foodList) {
		foodList.forEach(food => {
			collideLineCircle(this.x, this.y, this.sensor0X, this.sensor0Y, food.x, food.y, food.w)
		});
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
						this.synapse([1, 0, 0],speedFix)
					}
					if (sensor2 && !sensor1 && !sensor3) {
						speedFix++						
						//  console.log("sensor2")
						this.synapse([0, 1, 0],speedFix)
					}
					if (sensor3 && !sensor1 && !sensor2) {
						speedFix++
						//  console.log("sensor3")
						this.synapse([0, 0, 1],speedFix)
					}
					if (sensor1 && sensor2) {
						speedFix++
						//  console.log("sensor1 e 2")
						this.synapse([1, 1, 0],speedFix)
					}
					if (sensor1 && sensor3) {
						speedFix++
						//  console.log("sensor1 e 3")
						this.synapse([1, 0, 1],speedFix)
					}
					if (sensor2 && sensor3) {
						speedFix++
						//  console.log("sensor2 e 3")
						this.synapse([0, 1, 1],speedFix)
					}
					if (sensor1 && sensor2 && sensor3) {
						speedFix++
						//  console.log("sensor1 2 3")
						this.synapse([1, 1, 1],speedFix)
					}
				}
				if(collideCircleCircle(this.x,this.y,this.size,food.x,food.y,food.h)){
					food.eaten = true;
					this.belly += 100;
				}
		}
		this.synapse([0, 0, 0],speedFix)

	}

	this.synapse = function (input,speedFix) {
		this.output = this.brain.activate(input)
		// alert(this.output)
		if (this.output[0] > 0.5) {
			//up
			this.y += (sin(this.angle) * this.speed)/speedFix
			this.x += (cos(this.angle) * this.speed)/speedFix
		}
		if (this.output[1] > 0.5) {
			this.angle += this.swordSpeed/speedFix;
		}
		if (this.output[2] > 0.5) {
			this.angle -= this.swordSpeed/speedFix;
		}
	}


	// 	this.overlap = collideCircleCircle(this.x,this.y,this.size,enemy.x,enemy.y,enemy.d) // are we overlapping with the enemy?


} 