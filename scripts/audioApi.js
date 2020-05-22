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
	loadPianoSounds(); //getAllPianoNotes().forEach(soundName => loadSound(soundName));
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

	loadGuitarSounds();
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
function playSound(soundName, delay, stringNumber)
{
	// buffer = getBufferByName(soundName);
	buffer = allBuffers[soundName];
	var source = context.createBufferSource();
	source.buffer = buffer;

	// source.connect(context.destination);
	var gainNode = context.createGain()
	gainNode.gain.value = 1.0; // 10 %
	gainNode.connect(context.destination);
	source.playbackRate.value = playRate; //FOR SPREADING SAMPLE
	source.connect(gainNode);

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
			//STOP
			stringSources[stringNumber][1].gain.setTargetAtTime(0.0, context.currentTime, 0.1);
		}
		stringSources[stringNumber] = [source, gainNode];
	}

	activeSounds[soundName] = [source, gainNode];

	//add to array (to stop if needed), remove when finished playing
	// activeSounds.push(source);
	// setTimeout(function()
	// {
	// 	activeSounds.splice(activeSounds.indexOf(source), 1);
	// },buffer.duration*1000);
}

//e.g. guitar fret stop held down, keyboard key released
function playStoppableSound(buffer, delay, arrayId)
{
	var source = context.createBufferSource();
	let adjustedDelay = 0;
	source.buffer = buffer;
	source.connect(context.destination);

	if(delay != 0)
	{
		adjustedDelay = context.currentTime+delay/1000;
	}
	source.start(adjustedDelay);
	if(canBeStopped)
	{
		stoppableSounds.push(source);
	}
}

//only applies to sounds that cannot be duplicated
// e.g the same piano key, the same guitar string
//  need once played again, delete last source
// function stopSoundApi(stringNumber, delay)
// {
// 	//get source from activeSounds from soundName
// 	let bufferSource =  stringSources[stringNumber][0];
// 	let bufferGainNode =  stringSources[stringNumber][1];
// 	// setTimeout(function()
// 	// {
// 	// 	bufferGainNode.gain.value = 0.0;
// 	// }, delay);
// 	bufferGainNode.gain.setTargetAtTime(0.0, context.currentTime, 0.1);
//
// 	// stopSound(bufferSource, delay);
// }

function stopSoundApi(soundName, delay)
{
	activeSounds[soundName][1].gain.setTargetAtTime(0.0, context.currentTime, 0.1);
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
