var context;
var hatBuffer, kickBuffer, snareBuffer;
var allBuffers;
var guitarBuffers;
const filePath = 'aahat.mp3';
const KICK = 0;
const HAT = 1;
const SNARE = 2;
let contextInitiated = false;
let stoppableSounds, activeSounds;
// let activeSounds = {};

var chunks, mediaStreamDestination, mediaRecorder;
let isOggRecording = false;
let readyRecord = false;
//stores current playing sound for each string
//     i.e. only one per string is possible
let stringSources;
function initApi()
{
	context = new AudioContext();
	contextInitiated = true;
	// allBuffers = [];
	allBuffers = {};
	stoppableSounds = [];
	activeSounds = {};
	stringSources = [];
	guitarBuffers = make2dArray(6);


	chunks = [];
	mediaStreamDestination = context.createMediaStreamDestination();
	mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);

	mediaRecorder.ondataavailable = function(evt) {
		// Recorded data is in `e.data`
		chunks = [];
		chunks.push(evt.data);
	};

	mediaRecorder.onstop = function(evt) {
	   // Make blob out of our blobs, and open it.
	   var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
		 let test = URL.createObjectURL(blob);
		 loadSoundBlob(blob);
	   document.querySelector("audio").src = test;
	 };


	loadAllSounds();
	// setTimeout(function()
	// {
	// 	playSound(hatBuffer);
	// }, 500);
}

function getAudioContext()
{
	return context;
}

function checkAudioInit()
{
	return contextInitiated;
}

function make2dArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}
//need allbuffer = {}; allBuffers[kick] = buffer;
// var dogBarkingBuffer = null;
function loadAllSounds()
{
	loadSound('kick');
	loadSound('hat');
	loadSound('snare');
	loadSound('metronome');
	loadPianoSounds(); //getAllPianoNotes().forEach(soundName => loadSound(soundName));
	loadGuitarSounds();
	//should be based on keyamount, same loop as create keyboard
	//piano sounds loaded when keyboardbuilt?
	// loadSound('p1');
	// loadSound('p2');
	// loadSound('p3');
	// loadSound('p4');
	// loadSound('p5');
	// loadSound('p6');
	// loadSound('p7');
	//
	//
	// loadSound('pb1');
	// loadSound('pb2');
	// //gap for black keys, buildKeyboard() creates their IDs
	// loadSound('pb3');
	// loadSound('pb4');
	// loadSound('pb5');
	// loadSound('tap');

	// loadSound('kick.ogg', KICK);
	// loadSound('hat.ogg', HAT);
	// loadSound('snare.ogg', SNARE);
	// loadSound('p1.ogg', 3);
	// loadSound('p2.ogg', 4);
	// loadSound('p3.ogg', 5);
	// loadSound('p4.ogg', 6);
	// loadSound('p5.ogg', 7);
	// loadSound('p6.ogg', 8);
	// loadSound('p7.ogg', 9);
	// loadSound('pb1.ogg', 10);
	// loadSound('pb2.ogg', 11);
	// //gap for black keys, buildKeyboard() creates their IDs
	// loadSound('pb3.ogg', 13);
	// loadSound('pb4.ogg', 14);
	// loadSound('pb5.ogg', 15);
	// loadSound('tap.ogg', 16);
	// loadGuitarSounds();
}

function loadPianoSounds()
{
	//get key number
	let allPianoNotes = getAllPianoNotes();
	allPianoNotes.forEach(soundName => loadSound(soundName));
	// for(let i = 0; i < allPianoNotes.length; i++)
	// {
	// 	let soundName = allPianoNotes[i];
	// 	if(soundName.charAt(1) == 'b')
	// 	{
	// 		//if length 4, number is chars 2 and 3
	// 		let soundIndex = parseInt(soundName.charAt(2));
	// 		// let soundIndex = blackHotkeys.indexOf(keyCode);
	// 		let octave = Math.floor(soundIndex/5);
	// 		let offset = octave;
	// 		if(soundIndex >= 2)
	// 		{
	// 			offset += 1;
	// 		}
	// 		// tap('pb'+(soundIndex+1+offset));
	// 		soundName = 'pb'+(soundIndex+1+offset);
	// 	}
	// }
}

// function loadSound(url, bufferIndex, guitarFretIndex)
function loadSound(soundName)
{
  var request = new XMLHttpRequest();
	let urlWithFolder = 'sounds/'+soundName+'.ogg';
  request.open('GET', urlWithFolder, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function()
	{
    context.decodeAudioData(request.response, function(buffer)
		{
			//increment loading percentage
			allBuffers[soundName] = buffer;
			// if(url.charAt(0) == 'g')
			// if(urlWithFolder.charAt(7) == 'g')
			// if(urlWithFolder.charAt(7) == 'g')
			// {
			// 	guitarBuffers[bufferIndex-1][guitarFretIndex] = buffer;
			// }
			// else
			// {
			// 	allBuffers[bufferIndex] = buffer;
			// }
			// allBuffers.push(buffer);
    });
  }
  request.send();
}

let loopBuffer;
let blobLoopTimer;
function loadSoundBlob(blob)
{
	const fileReader = new FileReader()
	// Set up file reader on loaded end event
	fileReader.onloadend = function()
	{

    // const arrayBuffer = fileReader.result as ArrayBuffer;
		let myArrayBuffer = fileReader.result;

		// Convert array buffer into audio buffer
		// context.decodeAudioData(arrayBuffer, (audioBuffer) =>
    context.decodeAudioData(myArrayBuffer, function(audioBuffer)
		{
			loopBuffer = audioBuffer;
			playLoopBuffer();//start looping
		// 	blobLoopTimer = setInterval(function()
		// 	{
		// 		playLoopBuffer();//start looping
		// 	}, audioBuffer.duration*1000);
    });
	}

	fileReader.readAsArrayBuffer(blob);
	//Load blob
}

function playLoopBuffer()
{
	var source = context.createBufferSource();
	source.buffer = loopBuffer;
	source.connect(context.destination);
	source.start(0);
	source.loop = true;
}

function loadGuitarSounds()
{
	//from 1/0 to 6/22 (12 for now)
	// let string = 1;
	// let fret = 0;
	let url;
	for(string = 1; string <= 6; string++)
	{
		for(fret = 0; fret <= 12; fret++)
		{
			url = "g"+string+fret;
			//check url exists
			let allAudioTags = document.getElementsByTagName('audio');
			// for(let i = 0; )
			// allAudioTags.forEach(function()
			// {
		// });

			let exists = false;
			for(let i = 0; i < allAudioTags.length; i++)
			{
				let element = allAudioTags[i];
				if(url+"Audio" == element.id)
				{
					exists = true;
				}
			}

			if(exists)
			{
				// loadSound(url+".ogg", string, fret);
				loadSound(url);
			}

		}
	}
}

let transposePosition = 0;
let playRate = 1;

function transpose(direction)
{
	transposePosition+= direction;
	if(direction < 0)
	{
	    playRate = Math.pow(Math.pow(2, 1/12),-transposePosition);
			playRate = 1-(playRate-1);
		//go opposite direction, 1-(playRate-1);
		// playRate = Math.pow(Math.pow(2, 1/12),transposePosition);
	}
	else
	{
	    playRate = Math.pow(Math.pow(2, 1/12),transposePosition);
	}
}

//delay is in milliseconds
// function playSound(buffer, delay, stringNumber, soundName)
function playSound(soundName, delay, duration, stringNumber)
{
	// buffer = getBufferByName(soundName);
	buffer = allBuffers[soundName];
	var source = context.createBufferSource();
	source.buffer = buffer;
	source.playbackRate.value = playRate; //FOR SPREADING SAMPLE
	var gainNode = context.createGain();
	let volume = getVolumeFromSoundName(soundName);
	gainNode.gain.value = volume; // 10 %
	source.connect(gainNode);
	// source.connect(context.destination);
	//use instrument volumes
	if(readyRecord)
	{
		readyRecord = false;
		mediaRecorder.start();
	}
	gainNode.connect(mediaStreamDestination);
	gainNode.connect(context.destination);
	// if(isOggRecording)
	// {
	// 	gainNode.connect(mediaStreamDestination);
	// }
	// else {
	// 	gainNode.connect(context.destination);
	// }


	let adjustedDelay = 0;
	if(delay != 0)
	{
		adjustedDelay = context.currentTime+delay/1000;
	}
	source.start(adjustedDelay);

	if(stringNumber > 0)
	{
		if(	stringSources[stringNumber] != null)
		{
			// stringSources[stringNumber][0].stop();
			//STOP any playing sound on current string
			stringSources[stringNumber][1].gain.setTargetAtTime(0.0, context.currentTime, 0.1);
		}
		stringSources[stringNumber] = [source, gainNode];
	}

	//check if already exists, if so increment number


	//stop the sound if duration is null
	//  only recorded/queued notes (i.e. non player) notes will have duration
	if(duration != null)
	{
    // console.log(soundName + ' stopped at '+ delay + duration);
		//+1 at least for duration defined notes
		let indexedSoundName = getUnusedIndex(soundName);
		activeSounds[indexedSoundName] = [source, gainNode];

    gainNode.gain.setTargetAtTime(0.0, context.currentTime+(delay+duration)/1000, 0.1);
		setTimeout(function()
		{
			// activeSounds.splice(indexedSoundName, 1);
			activeSounds[indexedSoundName] = null;
		},delay+duration+200);
	}
	else
	{
		activeSounds[soundName] = [source, gainNode];
	}
	// stopSound()

	//add to array (to stop if needed), remove when finished playing
	// activeSounds.push(source);
	// setTimeout(function()
	// {
	// 	activeSounds.splice(activeSounds.indexOf(source), 1);
	// },buffer.duration*1000);
}

//only works for cpu played notes, really need seperate playSound or activeSound arrays
function getUnusedIndex(soundName)
{
	let indexedSoundName = soundName;
	let index = 1;
	//if exists, add one to index
	while(activeSounds[indexedSoundName+index] != null)
	{
		index++;
	}
	return indexedSoundName+index;
}

function readyToRecord()
{
	readyRecord = true;
}

function toggleOggRecording()
{
	isOggRecording = !isOggRecording;
	if(isOggRecording)
	{
		//starts on first playSound
		clearInterval(blobLoopTimer);
		readyToRecord();
	}
	else
	{
		mediaRecorder.stop();
	}
}

function stopSoundApi(soundName, delay)
{
	//need to delete after? doesnt take much space
	// console.log(soundName + ' stopped');
	let activeGainNode = 	activeSounds[soundName];
	if(activeGainNode != null) activeSounds[soundName][1].gain.setTargetAtTime(0.0, context.currentTime+delay/1000, 0.1);
	// setTimeout(function()
	// {
	// 	activeSounds[soundName] = null; //destroys any future repeated notes
	// }, 100);
}

// function stopSound(bufferSource, delay)
// {
// 	let adjustedDelay = 0;
// 	if(delay != 0)
// 	{
// 		adjustedDelay = context.currentTime+delay/1000;
// 	}
// 	bufferSource.stop(adjustedDelay);
// }

function getBufferByName(soundName)
{
	let buffer;
	let arrayIndex;
	// buffer
	if(soundName.charAt(0) == 'p')
	{
		if(soundName.charAt(1) == 'b')
		{
			// let bKeyNum = parseInt(soundName.charAt(2));
			// let bKeyAdd = 9;
			// if(bKeyNum > 2)
			// {
			// 	bKeyAdd = 8;
			// }
			//black keys start at 10
			arrayIndex = parseInt(soundName.charAt(2))+9;
		}
		else
		{
			arrayIndex = parseInt(soundName.charAt(1))+2;
		}
		buffer = allBuffers[arrayIndex];
	}

	if(soundName.charAt(0) == 'g')//guitar sounds
	{
		let string = parseInt(soundName.charAt(1)-1);
		let fret = parseInt(soundName.charAt(2));
		buffer = guitarBuffers[string][fret];
	}

	if(soundName == 'kick')
	{
		buffer = allBuffers[KICK];
	}
	else if(soundName == 'hat')
	{
		buffer = allBuffers[HAT];
	}
	else if(soundName == 'snare')
	{
		buffer = allBuffers[SNARE];
	}
	else if(soundName == 'metronome')
	{
		buffer = allBuffers[16];
	}

	return buffer;
}
