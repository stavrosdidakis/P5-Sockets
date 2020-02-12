var circleObject = [];
var socket;

function setup() {
  createCanvas(600, 400);
  background(255);
  smooth(8);
  strokeWeight(1);

  //Setup the GUI
  sp = new setGUIparameters();
  gui = new dat.GUI();
  initGui();

  //Create a new object - circle
  circleObject.push(new Circle(width/2, height/2, random(100,1000)));

  //Setup the communication
  socket = io.connect('http://localhost:5000');
  socket.on('clickEvent', newDrawing);
}

//When new data are received from the socket, run the newDrawing function
//to create a new object from the class
function newDrawing(data){
  console.log(data);
  circleObject.push(new Circle(data.xData, data.yData, data.speedXData, data.speedYData, data.radiusData, data.rData, data.gData, data.bData, data.lifeData, random(100,1000)));
}

//On mouse press, create a new circle object
function mousePressed(){
  let speedX = random(10.) - 5.;
  let speedY = random(10.) - 5.;
  let radiusCircle= sp.Set_Size;
  let r = sp.Color_Red;
  let g = sp.Color_Green;
  let b = sp.Color_Blue;
  let life = parseInt(random(100,1000));

  //Create a new object from the class in the array
  circleObject.push(new Circle(mouseX, mouseY, speedX, speedY, radiusCircle, r, g, b, life));
  let data = {
    xData: mouseX,
    yData: mouseY,
    speedXData: speedX,
    speedYData: speedY,
    radiusData: radiusCircle,
    rData: r,
    gData: g,
    bData: b,
    lifeData: life
  }
  socket.emit('clickEvent', data);
}

function draw() {
  background(255);
  for (var i=0; i<circleObject.length; i++) {
    circleObject[i].drawCircle();
    circleObject[i].motion();
    circleObject[i].destroy();
    //console.log(circleObject.length);
    if (circleObject[i].destroy() <= 0) {
      circleObject.splice(i,1);
    }
  }
}

//Circle class
function Circle(_x, _y, _speedX, _speedY, _radius, _r, _g, _b, _timer){
  this.x = _x;
  this.y = _y;
  this.xMove = _speedX;
  this.yMove = _speedY;
  this.radius= _radius;

  this.rd = _r;
  this.grn = _g;
  this.bl = _b;
  this.a = 255;

  this.timer = _timer;
  this.initTime = _timer;

  this.drawCircle = function(){
    noStroke();
    fillcol = color(this.rd, this.grn, this.bl, this.a)
    fill(fillcol);
    ellipse(this.x, this.y, this.radius*2, this.radius*2);
  }

  this.motion = function(){
    this.x += this.xMove;
    this.y += this.yMove;
    if (this.x > (width+this.radius)) this.x = 0 - this.radius;
    if (this.x < (0-this.radius)) this.x = width+this.radius;
    if (this.y > (height+this.radius)) this.y = 0 - this.radius;
    if (this.y < (0-this.radius)) this.y = height+this.radius;
  }

  this.destroy = function(){
    let getTimer;
    this.timer--;
    getTimer = this.timer;
    this.a = map(this.timer, 0, this.initTime, 0, 255);
    return getTimer;
  }
}

var initGui = function() {
  gui.add(sp, 'Set_Size', 10, 100);
  gui.add(sp, 'Color_Red', 0, 255);
  gui.add(sp, 'Color_Green', 0, 255);
  gui.add(sp, 'Color_Blue', 0, 255);
}

var setGUIparameters = function(){
  this.Set_Size = 50;
  this.Color_Red = 120;
  this.Color_Green = 120;
  this.Color_Blue = 120;
}
