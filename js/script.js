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
var camera = new THREE.PerspectiveCamera(viewAngle, aspectRatio, near, far);
//var camera = new THREE.OrthographicCamera ((width / - 1.5), width / 1.5, height / 1.5, height / - 1.5, near, far);
//create a new scene
var scene = new THREE.Scene();
scene.add(camera);
//prepare the rendering
var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
var element = renderer.domElement;
var container = document.getElementById('webglviewer');
container.appendChild(element);
//change the whole space color
var skyColor = new THREE.Color( 0.4549019607843137, 0.4196078431372549, 0.4549019607843137);
console.log(skyColor);
renderer.setClearColor(skyColor,1);
var effect = new THREE.StereoEffect(renderer);

//hitrule preparation
var hit=false;
var hitTime=0;

//challenge preparation
var clg=0;
//challenge is i-1;
//desX,desY,deadPoints,b-board
ElementInsideEachArrayList:
var clgArrList=[
[-width*(1/2-1/10),height*(1/2-1/10),0, 0 , 0 ],
[width/2-200,0,0, 2 , 0 ],
[-width*(1/2-1/10),-height*(1/2-1/10),0, 2 , 1 ]
];

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
var desPosX=clgArrList[clg][0], desPosY=clgArrList[clg][1],desPosZ=clgArrList[clg][2];

//set up the cube game space
var cubeWidth=5000, cubeHeight=5000,cubeDepth=5000;
var cubeGeometry = new THREE.BoxGeometry( cubeWidth, cubeHeight, 5000,50,50,50 );
var cubeMaterial = new THREE.MeshLambertMaterial( {color: 0x00ff00, wireframe:true} );
var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
cube.position.set(0,0,0);
//other
var showInfo=false;
var controls;
var clock = new THREE.Clock();
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
	// if(showInfo==true){
	// document.getElementById("oData").innerHTML = oText;
	// }
};

var latestMdata;
var onDeviceMotion= function(data){
	console.log(data);
	latestMdata=data;
	var mText = "MOTION DATA 10: <br />";
	mText += "Acc X :" + data.accelerationIncludingGravity.x + " <br />";
	mText += "Acc Y : " + data.accelerationIncludingGravity.y + " <br />";
	mText += "Acc Z : " + data.acceleration.z + " <br />";
	// if(showInfo==true){
	// document.getElementById("mData").innerHTML = mText;
	// }
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
function resize() {
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        effect.setSize(width, height);
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

function createDes(x,y,z){
		//init the destination
	desGeometry = new THREE.SphereGeometry( desSize, 10, 10 );
	desMaterial = new THREE.MeshLambertMaterial ( {color: 0xF95043, transparent: true,wireframe: true} );
	desMaterial.opacity=0;
	desSphere = new THREE.Mesh( desGeometry, desMaterial );
	scene.add( desSphere );
	desSphere.position.set(x,y,z);
}
function createSprite(sprS){
//init the sphere sprite, aha
	spriteGeometry = new THREE.SphereGeometry( sprS, 40, 40 );
	spriteMaterial = new THREE.MeshLambertMaterial ( {color: 0xF95043,transparent: true} );
	spriteMaterial.opacity=0;
	spriteSphere = new THREE.Mesh( spriteGeometry, spriteMaterial );
	scene.add( spriteSphere );
	spriteSphere.position.set(posX,posY,0);
}

function hitEffect(){
	//hit effect
spdX=0;
spdY=0;
posX+=spdX;
posY+=spdY;

	//enlarge the sprite
	spriteSphere.scale.x += 0.5;
	spriteSphere.scale.y += 0.5;
	spriteSphere.scale.z += 0.5;
//when scale is 80, change the challenge setting, 
//when it reaches 120, sprite appear in the center agein
	if(spriteSphere.scale.x>10){
				desMaterial.opacity=0;
	}
	if(spriteSphere.scale.x==50){
		clg++;
		desPosX=clgArrList[clg][0];
		desPosY=clgArrList[clg][1];
		desPosZ=clgArrList[clg][2];
		desSphere.position.set(desPosX,desPosY,desPosZ);
	}
	if(spriteSphere.scale.x==120){
		hit=false;
		spriteSphere.scale.set(1,1,1);
		posX=0;
		posY=0;
		spriteMaterial.opacity=0;
		desMaterial.opacity=0;
	}
}

function update(dt) {
        resize();

        camera.updateProjectionMatrix();

        controls.update(dt);
      }

function render(dt) {
        effect.render(scene, camera);
      }

function fullscreen() {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      }


//================side function OVER=================

//=================SETUP()================
function init(){

	//things need to be put, the mouse moving function, and window resize function
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);
	console.log(clgArrList);

controls = new THREE.OrbitControls(camera, element);
controls.target.set(
  camera.position.x + 0.15,
  camera.position.y,
  camera.position.z
);
controls.noPan = true;
controls.noZoom = true;

camera.position.set(0,0,1000);

// function setOrientationControls(e) {
//           if (!e.alpha) {
//             return;
//           }

//           controls = new THREE.DeviceOrientationControls(camera);
//           controls.connect();
//           controls.update();

//           element.addEventListener('click', fullscreen, false);

//           window.removeEventListener('deviceorientation', setOrientationControls, true);
//         }
// window.addEventListener('deviceorientation', setOrientationControls, true);

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

scene.add( cube );

createSprite(spriteSize);
createDes(desPosX,desPosY,desPosZ);

}
//=================SETUP() OVER================

//=================DRAW()=====================
function animatedRender(){

//rotate the destination sphere
desSphere.rotation.x += 0.03;
desSphere.rotation.x  += 0.03;

//initial the movement of sprite
	spdX+=accX;
	posX+=spdX;
	spdY+=accY;
	posY+=spdY;

//setting boundary
		if(posX>=cubeWidth/2+1){
		posX=cubeWidth/2;
		spdX=-spdX/4;
		accX=-accx/2;
	}
	else if(posX<=-(cubeWidth/2+1)){
		posX=-cubeWidth/2;
		spdX=-spdX/4;
		accX=-accx/2;
	}
	if(posY>=cubeHeight/2+1){
		posY=cubeHeight/2;
		spdY=-spdY/4;
		accY=-accY/2;
	} else if(posY<=-(cubeHeight/2+1)){
		posY=-cubeHeight/2;
		spdY=-spdY/4;
		accY=-accY/2;
	}
//check if the sprite hit the destination
if(posX>desPosX-20 
	&& posX<desPosX+20 
	&& posY>desPosY-20 
	&& posY<desPosY+20)
{
	hitTime++;
	hit=true;
} else {
	hitTime=0;
}
//show the objects
if(spriteMaterial.opacity<1){
	spriteMaterial.opacity+=0.02;
}
if(desMaterial.opacity<1){
	desMaterial.opacity+=0.02;
}
if(hit){
hitEffect();
}
// console.log(hitTime);

//move the sprite
	spriteSphere.position.set(posX,posY,0);

//set camera
// camera.position.set(0,0,1000);
// camera.position.set(0,0,1000);

	//prepare the render
	requestAnimationFrame( animatedRender );

update(clock.getDelta());
// render(clock.getDelta());
// effect.render(scene, camera);
renderer.render(scene, camera);
//render the graphic, yeah!!!
	// renderer.render(scene, camera);

	document.body.onkeyup = function(e){
    if(e.keyCode == 32){
    	hit=true;
	}

}
	}

//=================DRAW() OVER=====================

init();
animatedRender();
