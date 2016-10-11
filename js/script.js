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
//http://www.bbcollinsworth.com/web/mTest.html

var onOrientationChange = function(data){
	console.log('NEW DEVICE ORIENTATION DATA!:');
	console.log(data);
	
	var oText = "ORIENTATION DATA: <br />";

	oText += "Alpha (Yaw): " + data.alpha + " <br />";
	oText += "Beta (Pitch): " + data.beta + " <br />";
	oText += "Gamma (Roll): " + data.gamma + " <br />";

	oscillator.frequency.value= (data.alpha/360)*5000;
	gainNode.gain.value = .1;
	console.log("hey");
	document.getElementById("oData").innerHTML = oText;
};

//if this browser / device can detect device orientation events...
if (window.DeviceOrientationEvent){

	//add an event listener that calls the "onOrientationChange" function whenever the device's orientation data changes
	window.addEventListener('deviceorientation',onOrientationChange,false);
} else {
	console.log("ERROR: This browser can't detect orientation events");
}

//windows.DeviceMotionEvent
//"devicemotion"
var latestMdata;
//var cube.position= latestMdata.acceleration
//new THREE.Vector3(latestMData.acceleration.x,latestMData.acceleration.y,latestMData.acceleration.z);

var onDeviceMotion= function(data){
	console.log(data);
	latestMdata=data;

	var mText = "MOTION DATA: <br />";

	mText += "Acc X :" + data.accelerationIncludingGravity.x + " <br />";
	mText += "Acc Y : " + data.accelerationIncludingGravity.y + " <br />";
	mText += "Acc Z : " + data.accelerationIncludingGravity.z + " <br />";
	document.getElementById("mData").innerHTML = mText;
}

if(window.DeviceMotionEvent){
window.addEventListener("devicemotion",onDeviceMotion,false);
} else{
	console.log("error: no motion data!");
}
