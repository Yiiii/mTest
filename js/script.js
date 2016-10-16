//this function will enable/disable the mute mode on iOS
//function was introduced from here: ???
window.addEventListener('touchstart', function() {
	// create empty buffer
	var buffer = audioCtx.createBuffer(1, 1, 22050);
	var source = audioCtx.createBufferSource();
	source.buffer = buffer;
	// connect to output (your speakers)
	source.connect(audioCtx.destination);
	// play the file
	source.noteOn(0);
}, false);
//
var width=window.innerWidth;
var height= window.innerHeight;
console.log(width+","+height);
//audio preparation
var audioCtx= new (window.AudioContext||window.webkitAudioContext);
var oscillator = audioCtx.createOscillator();
var gainNode= audioCtx.createGain();
var delaynNode = audioCtx.createDelay(5.0);

oscillator.type = 'sine';
oscillator.frequency.value = 100;
oscillator.start(0);
gainNode.gain.value=0.1;
oscillator.connect(delaynNode);
delaynNode.connect(gainNode);
gainNode.connect(audioCtx.destination);

//make a new camera
var viewAngle = 75;
var aspectRatio = width / height;
var near = 0.1;
var far = 80000;
// var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
var camera = new THREE.OrthographicCamera ((width / - 1.5), width / 1.5, height / 1.5, height / - 1.5, near, far);
//create a new scene
var scene = new THREE.Scene();
//prepare the rendering
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//change the whole space color
var skyColor = new THREE.Color( 0.4549019607843137, 0.4196078431372549, 0.4549019607843137);
console.log(skyColor);
renderer.setClearColor(skyColor,1);

//sprite preparation
var spriteSize=30;
var spriteGeometry;
var spriteMaterial;
var spriteSphere;
var posX=0,posY=0,spdX=0,spdY=0, accX=0,accY=0;
//destination preparation
var desSize=50;
var desGeometry;
var desMaterial;
var desSphere;
var desPosX=-width*(1/2-1/10),desPosY=height*(1/2-1/10);
//hitrule preparation
var hit=false;
var hitTime=0;


//================side function=================
var onOrientationChange = function(data){
	console.log('NEW DEVICE ORIENTATION DATA!:');
	console.log(data);
	var oText = "ORIENTATION DATA: <br />";
	oText+=width;
	oText+=",";
	oText+=height;
	oText+=" <br />";
	oText += "Alpha (Yaw): " + data.alpha + " <br />";
	oText += "Beta (Pitch): " + data.beta + " <br />";
	oText += "Gamma (Roll): " + data.gamma + " <br />";
	//change sound based on orientation
	oscillator.frequency.value= (data.alpha/360)*5000;
	gainNode.gain.value = .1;
	console.log("hey");
	document.getElementById("oData").innerHTML = oText;
};

var latestMdata;
var onDeviceMotion= function(data){
	console.log(data);
	latestMdata=data;
	var mText = "MOTION DATA 10: <br />";
	mText += "Acc X :" + data.accelerationIncludingGravity.x + " <br />";
	mText += "Acc Y : " + data.accelerationIncludingGravity.y + " <br />";
	mText += "Acc Z : " + data.acceleration.z + " <br />";
	document.getElementById("mData").innerHTML = mText;
	accX=data.accelerationIncludingGravity.x/4;
	accY=data.accelerationIncludingGravity.y/4;


}

var Vec3 = function (x,y,z){
	return new THREE.Vector3(x,y,z);
};

function onDocumentMouseMove(event){
	mouseX = (event.clientX - width/2);
	mouseY = (event.clientY -height/2);
}

function onWindowResize(){
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width, height);
}

//if this browser / device can detect device orientation events...
if (window.DeviceOrientationEvent){
//add an event listener that calls the "onOrientationChange" function whenever the device's orientation data changes
	window.addEventListener('deviceorientation',onOrientationChange,false);
} else {
	console.log("ERROR: This browser can't detect orientation events");
}

if(window.DeviceMotionEvent){
window.addEventListener("devicemotion",onDeviceMotion,false);
} else{
	console.log("error: no motion data!");
}

function createDes(){
		//init the destination
	desGeometry = new THREE.SphereGeometry( desSize, 10, 10 );
	desMaterial = new THREE.MeshLambertMaterial ( {color: 0xF95043, wireframe: true} );
	desSphere = new THREE.Mesh( desGeometry, desMaterial );
	scene.add( desSphere );
	desSphere.position.set(desPosX,desPosY,0);
}
function createSprite(){
//init the sphere sprite, aha
	spriteGeometry = new THREE.SphereGeometry( spriteSize, 40, 40 );
	spriteMaterial = new THREE.MeshLambertMaterial ( {color: 0xF95043} );
	spriteSphere = new THREE.Mesh( spriteGeometry, spriteMaterial );
	scene.add( spriteSphere );
	spriteSphere.position.set(posX,posY,0);
}

//================side function OVER=================

//=================SETUP()================
function init(){

	//things need to be put, the mouse moving function, and window resize function
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);
	
	// create and add a working-in-process light
	var pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(10,50,200)
	scene.add(pointLight);
	//add an ambient light
	var ambientLight = new THREE.AmbientLight(0x404040,2.4);
	scene.add(ambientLight);
	spdX+=accX;
	spdY+=accY;
	posX+=spdX/2;
	posY+=spdY/2;

createSprite();
createDes();

}
//=================SETUP() OVER================

//=================DRAW()=====================
function animatedRender(){
	//prepare the render
	requestAnimationFrame( animatedRender );
	
//rotate the destination sphere
desSphere.rotation.x += 0.005;
desSphere.rotation.x  += 0.01;

//initial the movement of sprite
	spdX+=accX;
	posX+=spdX;
	spdY+=accY;
	posY+=spdY;

//setting boundary
		if(posX>=width/2+1){
		posX=width/2;
		spdX=-spdX/4;
		accX=-accx/2;
	}
	else if(posX<=-(width/2+1)){
		posX=-width/2;
		spdX=-spdX/4;
		accX=-accx/2;
	}
	if(posY>=height/2+1){
		posY=height/2;
		spdY=-spdY/4;
		accY=-accY/2;
	} else if(posY<=-(height/2+1)){
		posY=-height/2;
		spdY=-spdY/4;
		accY=-accY/2;
	}
//check if the sprite hit the destination
if(hit==false){
if(posX>desPosX-20 && posX<desPosX+20 && posY>desPosY-20 && posY<desPosY+20){
// hitTime++;
	// if(hitTime>300){
	// 	hit=true;
	// }
	// hit=true;
	// if(hit){
	posX=desPosX;
	posY=desPosY;
	spriteSize++;
	mText += "HIT";
// }
} else {
	hitTime=0;
}
}
//hit effect
// if(hit){
// 	posX=desPosX;
// 	posY=desPosY;
// 	spriteSize=50;
// 	mText += "HIT";
// }



//move the sprite
	spriteSphere.position.set(posX,posY,0);

//set camera
// camera.position.set(0,0,1000);
camera.position.set(0,0,2500);

//render the graphic, yeah!!!
	renderer.render(scene, camera);
	}

//=================DRAW() OVER=====================

init();
animatedRender();
