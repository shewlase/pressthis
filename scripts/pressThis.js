//VIEW
//route all events to controller
// click (drum) - controller.handleTap() - model/game.tap() - stage/instrument.tap()
var drumDiv, hat, snare, kick;
var helpText;
let fretHand, cursorImage;
let fullWhite;
let tempoButton;
let mouseX, mouseY; //should setMousePosition();
let hotkeyLetters;
let showHotkeys = false;
let allHotkeys;
let studioDiv, guitarDiv;
let recordButton1;
//CONTROLLER
	//only View() and Model() (Game())?
	//handleTap() -> game.tap();
//MODEL - GAME
var testingLocal;
let isInitTap = true;
var isAudioInit = false;
let isLoopTutorial = false;
var clickNumber = 0;
var correctTaps = 0;
let quickTapCount = 0;
let phaseNumber = 0;
let isTouchScreen = false;

let whiteKeyNum = 0;
let blackKeyNum = 0;
let highlightKeys = true; //change colour on keypress

let songProgress = 0;
let pianoVolume = 1.0;
let guitarVolume = 0.2;

let volumeDragStart, volumeInstrument;
let isDraggingVolume = false;

var currentNote;
var stageComplete = false;
const STUDIO = 0;
const INTRO = 1;
const TWO = 2;
const QUICK = 3;
let stages = [STUDIO, INTRO, TWO, QUICK];
let stage = INTRO;
let quickMode = 'learn'; //play and learn
let leftMouseDown = false;
let multipleGuide, songTitle, progressBar;//could make it quickDiv
//images not used initially but change with user events
let animationImages = ["images/whiteKeyHighlighted.png", "images/blackKeyHighlighted.png",
		"images/cursorDown.png", "images/fretUp.png", "images/fretE.png", "images/fretA.png", "images/trackButtonRecording.png",
		 "images/trackButtonPlaying.png", "images/trackButtonEmpty.png", "images/pinchCursor.png",
	 "images/stringThumbDown.png", "images/stringIndexDown.png", "images/stringMiddleDown.png",
 	"images/stringRingDown.png"];
var preLoaded;
//Studio/StageX

var loopStartTime;
var drumLoopStartTime;
let drumTrackS1 = new Track();
let pianoTrackS1 = new Track();
let randomTrack = new Track();
let inputEnabled = true;
var notesInOrder = ['hat','snare','kick','snare','snare','snare','kick','hat','snare','hat','kick','hat','snare','hat',
							'p3','p3','p2','p1','p3','p2','p1','p2','p3'];
var notesAndPhases =
[
	['hat'],
	['snare'],
	['kick'],
	['snare','snare','snare'],
	['kick','hat','snare'],
	['kick','hat','snare','hat','kick'],
	['kick','hat','snare','hat','kick','hat','snare'],
	['p3'],
	['p3','p2','p1'],
	['p3','p2','p1','p2','p3'],
	['p3','p2','p1','p2','p3','p3','p3']
];

let pentaPianoNotes = ['p1', 'p2', 'p3', 'p5', 'p6'];
let allDrums = ['kick', 'hat', 'snare'];
var noteCount = -1;
var beatTime = 300;
let loopTimer, loopTimers;
//Guitar
let fretHandDown = false;
let fretKeysHeld = 0;
let playingStrings;
//Keyboard
var blackKeys = [];
let whiteKeyHotkeys = ["r", "t", "y", "u", "i", "o", "p"];
let blackKeyHotkeys = ["5", "6", "8", "9", "0"];
let allPianoNotes = [];
let threeToShow = [];
// let firstRiffNotes = ['p1', 'p3', 'p5', 'p1', 'p3', 'p5', 'p1', 'p3'];
let firstRiffNotes = ['p1', 'p3', 'p5', 'p1', 'p3', 'p5', 'p1', 'p3', 'p2', 'p4', 'p6',
 		'p2', 'p4', 'p6', 'p2', 'p4', 'p3', 'p5', 'p7', 'p3', 'p5', 'p7', 'p3', 'p5',
		'p2', 'p4', 'p6', 'p2', 'p4', 'p6', 'p2', 'p4'];
let secondRiffNotes = ['p5', 'p1', 'p3', 'p1', 'p5', 'p1', 'p3', 'p1', 'p6', 'p2',
			'p4', 'p2', 'p6', 'p2', 'p4', 'p2', 'p7', 'p3', 'p5', 'p3', 'p7', 'p3', 'p5',
		'p3', 'p6', 'p2', 'p4', 'p2', 'p6', 'p2', 'p4', 'p2'];
let thirdRiffNotes = ['p1', 'p1', 'p3', 'p3', 'p5', 'p5', 'p7', 'p7', 'p2', 'p2', 'p4',
 				'p4', 'p6', 'p6', 'p7', 'p7'];
let fourthRiffNotes = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p6', 'p5', 'p4', 'p3', 'p2', 'p1',
						'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p6', 'p5', 'p4', 'p3', 'p2', 'p1'];
let maryHadNotes = ['p3', 'p2', 'p1', 'p2', 'p3', 'p3', 'p3', 'p2', 'p2', 'p2', 'p3', 'p5',
		'p5', 'p3', 'p2', 'p1', 'p2', 'p3', 'p3', 'p3', 'p3', 'p2', 'p2', 'p3', 'p2', 'p1'];
let rowRowNotes = ['p1', 'p1', 'p1', 'p2', 'p3', 'p3', 'p2', 'p3', 'p4', 'p5', 'p7', 'p7',
		'p7', 'p5', 'p5', 'p5', 'p3', 'p3', 'p3', 'p1', 'p1', 'p1', 'p5', 'p4', 'p3', 'p2', 'p1']
let oldMacNotes = ['p5', 'p5', 'p5', 'p2', 'p3', 'p3', 'p2', 'p7', 'p7', 'p6', 'p6', 'p5',
				'p2', 'p5', 'p5', 'p5', 'p2', 'p3', 'p3', 'p2', 'p7', 'p7', 'p6',
				'p6', 'p5', 'p2', 'p2', 'p5', 'p5', 'p5', 'p2', 'p2', 'p5', 'p5',
				'p5', 'p5', 'p5', 'p5', 'p5', 'p5', 'p5', 'p5', 'p5', 'p5', 'p5',
				'p5', 'p5', 'p5', 'p5', 'p5', 'p2', 'p3', 'p3', 'p2', 'p7', 'p7', 'p6', 'p6', 'p5'];
let twinkleNotes = ['p1', 'p1', 'p5', 'p5', 'p6', 'p6', 'p5', 'p4', 'p4', 'p3', 'p3',
 'p2', 'p2', 'p1', 'p5', 'p5', 'p4', 'p4', 'p3', 'p3', 'p2', 'p5', 'p5', 'p4',
 'p4', 'p3', 'p3', 'p2', 'p1', 'p1', 'p5', 'p5', 'p6', 'p6', 'p5', 'p4',
 'p4', 'p3', 'p3', 'p2', 'p2', 'p1'];

let twinkleTrack = new Track(1, twinkleNotes, true, 'Twinkle Twinkle');
let maryHadTrack = new Track(1, maryHadNotes, true, 'Mary Had A Little Lamb');
let rowRowTrack = new Track(1, rowRowNotes, true, 'Row Row Row Your Boat');
let oldMacTrack = new Track(1, oldMacNotes, true, 'Old Mc Donald');

let firstRiffTrack = new Track(1, firstRiffNotes, true, 'First Riff');
firstRiffTrack.phaseLengths = [8, 8, 8, 8];
let secondRiffTrack = new Track(1, secondRiffNotes, true, 'Second Riff');
secondRiffTrack.phaseLengths = [4,4,4,4,4,4,4,4];
let thirdRiffTrack = new Track(1, thirdRiffNotes, true, 'Third Riff');
// thirdRiffTrack.phaseLengths = [8, 8, 8, 8];

let fourthRiffTrack = new Track(1, fourthRiffNotes, true, 'Fourth Riff');

// let twinkle = new Song('Twinkle Twinkle', twinkleNotes);


let phasePos, phaseStart, thisPhaseSize;
// let phaseStart = phasePos*phaseSize;//will be add all previous notes
let riffProgress = 0;
// let phaseSize = 7;//will be dynamic phaseLengths[phasePos]
// let thisPhaseSize;
let allRiffs = [];
// let firstRiff = ['p1', 'p3', 'p5', 'p7'];

let currentRiff = [];
let currentRifNumber = 0;
let wrongNoteCount = 0;

let keyboardRight;
let windowWidth;

let drumHotkeys, guitarHotkeys;

//need tempo and timing here
//tempo = 90; //bpm
init();
function init()
{
	testingLocal = window.location.protocol == ("file:");
	windowWidth = window.innerWidth;
	hat = document.getElementById("hat");
	kick = document.getElementById("kick");
	snare = document.getElementById("snare");
	drumDiv = document.getElementById("drumDiv");
	helpText = document.getElementById("helpText");
	cursorImage = document.getElementById("cursorImage");
	fretHand = document.getElementById("fretHand");
	fullWhite  = document.getElementById("fullWhite");
	tempoButton  = document.getElementById("tempoButton");
	studioDiv =  document.getElementById("studioDiv");
	multipleGuide = document.getElementById('multipleGuide');
	songTitle = document.getElementById('songTitle');
	progressBar = document.getElementById('progressBar');
	keyboardRight = document.getElementById('keyboardRight');
	guitarDiv = document.getElementById("guitarDiv");
	recordButton1 = document.getElementById("recordButton1");
	initTouchDetect();
	refreshVolumeKnobs();
	// document.appendChild(multipleGuide);
	// loadSounds();
	preLoaded = [];
	playingStrings = [];
	hotkeyLetters = [];
	allHotkeys = [];
	drumHotkeys = ['j', 'k', 'l'];
	guitarHotkeys = ['a', 's', 'd', 'z', 'x', 'c', 'n4', 'n5', 'n6'];

	loopTimers = [];
  initS1Loops();

	setStage(stage); //keyboard must be build after inittouch for event differentiation
	// buildKeyboard(15);
	//bad, needs this before init api or allPianoNotes list creation
	deleteAllKeyElements();
	buildKeyboard(15);
	addVolumeEventSquares();
	scaleAndPosition(keyboardDiv, -40, 30, 1.5);

	addVolumeEventSquares();
	// initStageTwo();
	loadImages();
	createDrumHotkeys();
	createGuitarHotkeys();
	setTimeout(createKeyboardHotkeys, 1000);

}

function initTouchDetect()
{
	hat.onmousedown = () => initTap('mouse');
	hat.ontouchstart = function(evt)
	{
		// evt.preventDefault(); //stops api init...
		initTap('touch');
		hat.removeEventListener("mousedown", function()
		{
			tap(id);
		});
	}
}

function setStage(stageId)
{
	stage = stageId;
	if(stage == INTRO)
	{
		initStageOne();
	}
	else if(stage == STUDIO)
	{
		initStudio();
	}
	else if(stage == QUICK)
	{
		initQuick();
		// initThreeShow();
	}
}

function initQuick()
{
	// snare.style.display = "none";
	// kick.style.display = "none";
	// hat.style.display = "none";
	// allRiffs = [firstRiff, secondRiff, thirdRiff, fourthRiff];

	songTitle.style.display = 'block';
	multipleGuide.style.display = 'block';
	progressBar.style.display = 'block';
	drumDiv.style.display = "none";
	guitarDiv.style.display = 'block';

	//need tracks div?
	recordButton1.style.display = 'none';
	document.getElementById("trashTrack1").style.display = 'none';
	// // helpText.style.opacity = "0";
	// helpText.style.transform = "rotate(0deg)";
	helpText.innerHTML = "Play first key to start timer";
	// helpText.style.left = "45vw";
	helpText.style.top = "40vw";
	helpText.style.width = "100vw";
	helpText.style.textAlign = "center";
	helpText.style.rotate = "0deg";
	tempoButton.style.display = 'none';
	//
	drumDiv.style.display = "none";
	// drumDiv.style.height = "40vh";
	// drumDiv.style.left = "5vw";
	// drumDiv.style.top = "2vw";
	// keyboardDiv.style.top = "9vw";
	// keyboardDiv.style.left = "20vw";
	// keyboardDiv.style.height = "25vw"; //need to rebuild, 8 keys
	deleteAllKeyElements();
	buildKeyboard(8);
	addVolumeEventSquares();
	scaleAndPosition(keyboardDiv, 8, 40, 0.5); //has to be after build keyboard

	// keyboardDiv.style.width = "60vw";
	cursorImage.style.width = "5vw";
	studioDiv.style.display = "none";
	// startRandomPhases();

	//on song select, set allRiffs etc
	//on quickMode select, choose whether to play first phase or just show next 3
	// allRiffs = [rowRowTrack, oldMacTrack, maryHadTrack, twinkleTrack];
	// allRiffs = [firstRiffTrack, secondRiffTrack, thirdRiffTrack, fourthRiffTrack];
	allRiffs = [secondRiffTrack];
	currentRiff = allRiffs[0];
	if(quickMode == 'play')
	{
		// currentRiff = allRiffs[0].notes;
		// allRiffs = [twinkleTrack];
		// allRiffs = [twinkleTrack];
		// currentRiff = allRiffs[0];
		updateThreeKeys();
	}
	else if(quickMode == 'learn')
	{
		// allRiffs = [twinkleTrack];
		// currentRiff = allRiffs[0];
		phasePos = 0;
		riffProgress = 0;
		// phaseSize = 7;//will be dynamic phaseLengths[phasePos]
		thisPhaseSize = currentRiff.phaseLengths[phasePos];
		phaseStart = phasePos*thisPhaseSize;//will be add all previous notes
		currentRiff.queueSomeNotes(phaseStart, phaseStart+thisPhaseSize, 0);
		updateThreeKeys();//do this after notes played
		//when reached correct end of phase, play next part
		// currentRiff.queueSomeNotes(phaseStart, phaseStart+phaseSize, 0);
		// phasePos++;


		// createCloseRandomPhase(5);
		// createOneRandomPhase(5);
		// randomTrack.queueAllNotes(0);
	}

	// initThreeShow();
}

function startRandomPhases()
{
	createRandomPhases();
}

function createOneRandomPhase(noteCount)
{
	randomTrack = new Track();
	randomTrack.title = 'Randomed Phase';
	randomBeats = 0;
	for(let i = 0; i < noteCount; i++)
	{
		// let randomNoteId = allPianoNotes[Math.floor(Math.random()*allPianoNotes.length)];

		//TODO: instead of random, make random up or down 1/2 notes from last one
		//   (first one only random)
		let randomNoteId = pentaPianoNotes[Math.floor(Math.random()*pentaPianoNotes.length)];

		//betwween 0.5 and 2?, how to studder by 5 1-4 then x0.5

		if(i!=0) randomBeats += Math.ceil(Math.random()*4)*0.5+0.5;
		// let beatsDif = Math.ceil(Math.random()*4)*0.5+0.5;
		// let beatsFromStart = i;//if 1 beat increase
		//random duration too?
		randomTrack.addNote(randomNoteId, randomBeats, 300);
	}
	randomTrack.queueAllNotes(0);
	// loopRandomTrack(randomTrack, 0);
}

function createCloseRandomPhase(noteCount)
{
	randomTrack = new Track();
	randomTrack.title = 'Randomed Close Phase';
	randomBeats = 0;
	let lastNotePos = Math.floor(Math.random()*pentaPianoNotes.length);
	randomTrack.addNote(pentaPianoNotes[lastNotePos], 0, 300);
	for(let i = 1; i < noteCount; i++)
	{
		// -1, 0, 1  0 1 2
		let rand = (Math.floor(Math.random()*2)+1);
		if(rand == 2) rand = -1;
		let randomClosePos = lastNotePos + rand;
		// let randomClosePos = lastNotePos + (Math.floor(Math.random()*3)-1);

		if(randomClosePos > pentaPianoNotes.length-1)
		{
			randomClosePos = 0;
		}

		if(randomClosePos < 0)
		{
			randomClosePos = pentaPianoNotes.length-1;
		}

		let thisNote = pentaPianoNotes[randomClosePos];
		// console.log(randomClosePos, thisNote);
		//between 0.5 and 2??
		if(i!=0) randomBeats += Math.ceil(Math.random()*2)*+0.5;

		randomTrack.addNote(thisNote, randomBeats, 300);
		lastNotePos = randomClosePos;
	}
	// loopRandomTrack(randomTrack, 0);
	return randomTrack;
}

function getAllPianoNotes()
{
	return allPianoNotes;
}

//get 3 random keys, change the three images
function initThreeShow()
{
	let randomNoteId = allPianoNotes[Math.floor(Math.random()*allPianoNotes.length)];
	threeToShow.push(randomNoteId);
	let randomNoteId2 = randomNoteId;
	let randomNoteId3 = randomNoteId;
	// while(randomNoteId2 == randomNoteId)
	while(threeToShow.includes(randomNoteId2))
	{
		randomNoteId2 = allPianoNotes[Math.floor(Math.random()*allPianoNotes.length)];
	}
	threeToShow.push(randomNoteId2);

	// while(randomNoteId3 == randomNoteId || randomNoteId3 == randomNoteId2)
	while(threeToShow.includes(randomNoteId3))
	{
		randomNoteId3 = allPianoNotes[Math.floor(Math.random()*allPianoNotes.length)];
	}
	threeToShow.push(randomNoteId3);

	// threeToShow[0] = randomNoteId;
	// threeToShow[1] = randomNoteId2;
	// threeToShow[2] = randomNoteId3;
	updateThreeKeys();
}

function countAnyRepeats()
{
	//keep adding one until doesn't match
	//need to have next riff combined with current for end of songs
	let currentNote = currentRiff.notes[riffProgress].soundName;
	let count = 1;
	for(let i = riffProgress+1; i < currentRiff.notes.length; i++)
	{
		let compareNote = currentRiff.notes[i].soundName;
		if(currentNote == compareNote)
		{
			count++;
		}
		else
		{
			break
		}
	}

	let keyToDraw = document.getElementById(currentNote);
	let show = '';
	if(count > 1)
	{
		show = count+'x';
	}
	else
	{
		// show = '';
		show = '&#9650';
	}
	writeAt(show, keyToDraw.getBoundingClientRect().left, keyToDraw.getBoundingClientRect().top+keyToDraw.getBoundingClientRect().height);
}

//checks for x2/x3 in a row
function countAnyRepeatsLastThree(nextThree)
{
	let counters = [];//count each note
	let index = 0;
	// let thisCount = 0;
	nextThree.forEach((note) =>
	{
		let count = 0;
		nextThree.forEach((note2) =>
		{
			if(note == note2)
			{
				count++;
			}

		})
		counters[index] = count;
		index++;
	})

	index = 0;
	if(counters[0] > 1)
	{
		let keyToDraw = document.getElementById(nextThree[0]);

		writeAt(counters[0]+'x', keyToDraw.getBoundingClientRect().left, keyToDraw.getBoundingClientRect().top+keyToDraw.getBoundingClientRect().height)

	}


	// counters.forEach((tally) =>
	// {
	// 	if(tally > 1)
	// 	{
	// 		let keyToDraw = document.getElementById(nextThree[index]);
	//
	// 		writeAt(tally+'x', keyToDraw.getBoundingClientRect().left, keyToDraw.getBoundingClientRect().top+keyToDraw.getBoundingClientRect().height)
	// 	}
	// 	index++;
	// })

	return counters;
}

//TODO: add if play together (i.e. no gap between patterns)
//      other instruments, handling of end of all riffs
//      if learning, dont show until phase played
function updateThreeKeys()
{
	//should only do this when songs change
	songTitle.innerHTML = allRiffs[currentRifNumber].title;
	// document.querySelector('#songTitle').innerHTML = allRiffs[currentRifNumber].name;
	let nextRiff = allRiffs[currentRifNumber+1];
	if(nextRiff == null) nextRiff = allRiffs[0];
	let nextThreeNotes = []; //1st 2nd 3rd
	// count how many of each key, if > 1, writeAt

	if(riffProgress >= currentRiff.notes.length-2)
	{
		//need check if repeating, allRiffs build to include same array multiple times
		let hitsTillEnd = currentRiff.notes.length-riffProgress;
		if(hitsTillEnd == 2)
		{
			nextThreeNotes[2] = nextRiff.notes[0].soundName;
			nextThreeNotes[1] = currentRiff.notes[riffProgress+1].soundName;
		}
		else if(hitsTillEnd == 1)
		{
			nextThreeNotes[2] = nextRiff.notes[1].soundName;
			nextThreeNotes[1] = nextRiff.notes[0].soundName;
		}
	}
	else
	{
		nextThreeNotes[2] = currentRiff.notes[riffProgress+2].soundName;
		nextThreeNotes[1] = currentRiff.notes[riffProgress+1].soundName;
	}

	if(riffProgress == currentRiff.notes.length)
	{
		nextThreeNotes[2] = nextRiff.notes[2].soundName;
		nextThreeNotes[1] = nextRiff.notes[1].soundName;
		nextThreeNotes[0] = nextRiff.notes[0].soundName;
	}
	else
	{
		nextThreeNotes[0] = currentRiff.notes[riffProgress].soundName;
	}
	countAnyRepeats();
	// countAnyRepeatsLastThree(nextThreeNotes);
	document.getElementById(nextThreeNotes[2]).src = 'images/whiteH3.png';
	document.getElementById(nextThreeNotes[1]).src = 'images/whiteH2.png';
	document.getElementById(nextThreeNotes[0]).src = 'images/whiteH1.png';
}

//measure @ 4xbeattime, rounds to half measure?
function roundUpToNearestMeasure(timeMs)
{
	let timeAsBeat = timeMs/beatTime;
	while(timeAsBeat % 4 != 0)
	{
		timeAsBeat += 0.5;
	}
	return timeAsBeat*beatTime;
}

function createRandomPhases()
{
	//define how many notes
	let noteNumber = 30;
	for(let i = 0; i < noteNumber; i++)
	{
		let randomNoteId = Math.floor(Math.random()*allPianoNotes.length);
		let beatsFromStart = i;
		randomTrack.addNote(randomNoteId, i, 300);
	}

	for(let i = 0; i < allPianoNotes.length; i++)
	{
		let note = allPianoNotes[i];
	}
}

function startLoopTutorial()
{
	isLoopTutorial = true;
	tempoButton.style.right = "45vw";
	tempoButton.style.bottom = "20vw";
	//only for loop tutorial
	// helpText.style.opacity = "0";
	fullWhite.style.opacity = "1.0";
	helpText.style.transform = "rotate(0deg)";
	helpText.innerHTML = "Press 4x to </br> set speed";
	helpText.style.left = "40vw";
	helpText.style.top = "30vw";
	helpText.style.width = "";

	document.getElementById("fullWhite").style.display = "block";
	// document.getElementById("tempoButton").style.display = "block";
	// recordButton1.style.display = 'none';
	// document.getElementById("trashTrack1").style.display = 'none';
}

function checkIfLoopTutorial()
{
	return isLoopTutorial;
}

function hideLoopTutorialStart()
{
	helpText.style.transform = "rotate(-5deg)";
	helpText.innerHTML = "Play something!";
	helpText.style.left = "5vw";
	helpText.style.top = "40vw";
	fullWhite.style.opacity = "0.0";
	tempoButton.style.bottom = "3vw";
	tempoButton.style.right = "3vw";
	//only if intro
	setTimeout(function()
	{
		fullWhite.style.display = "none";
	}, 1000);//match transition time
}

//should be refreshScalePos(div) and take keyboard.x = 10, refresh(keyboard);
function scaleAndPosition(div, x, y, scale)
{
	div.style.transform = "translate("+x+"vw, "+y+"vh) scale("+scale+")";
}

function initStudio()
{
	snare.style.opacity = "1";
	kick.style.opacity = "1";

	multipleGuide.style.display = 'none';
	songTitle.style.display = 'none';
	progressBar.style.display = 'none';
	guitarDiv.style.display = 'block';
	helpText.style.opacity = '0';


	// drumDiv.style.width = "40vw";
	// drumDiv.style.height = "40vh";
	// drumDiv.style.left = "2vw";
	// drumDiv.style.top = "2vw";


	// keyboardDiv.style.top = "6vw";
	// keyboardDiv.style.left = "37vw";
	// keyboardDiv.style.height = "12vw";
	// scaleAndPosition(keyboardDiv, 8, 40, 1); //has to be after build keyboard

	deleteAllKeyElements();
	buildKeyboard(15);
	addVolumeEventSquares();
	scaleAndPosition(keyboardDiv, 8, 20, 0.5); //has to be after build keyboard
	scaleAndPosition(drumDiv, 55, 30, 0.5);
	scaleAndPosition(guitarDiv, 5, 60, 0.55);
	// drumDiv.style.transform = "translate(65vw, 32vh) scale(0.4)";
	drumDiv.style.display = "block";
	// keyboardDiv.style.transform = "translate(8vw, 40vh) scale(0.6)";

	// guitarDiv.style.display = 'block';

	cursorImage.style.width = "5vw";
	// studioDiv.style.display = "block";
	// tempoButton.style.display = 'block';
	// unhighlightPiano();

	// can use like getAllTracks()[trackNumber];
	getAllTracks()[1].isRecording = true;
}

function initStageOne()
{
	snare.style.opacity = "0";
	kick.style.opacity = "0";
	helpText.style.opacity = "1";

	multipleGuide.style.display = 'none';
	songTitle.style.display = 'none';
	progressBar.style.display = 'none';

	helpText.innerHTML = "Press this!";
	helpText.style.top = "21vw";
	helpText.style.left = "32vw";
	helpText.style.transform = "rotate(-15deg)";
	fullWhite.style.display = 'none';

	tempoButton.style.display = 'none';
	drumDiv.style.display = 'block';
	guitarDiv.style.display = 'none';

	// drumDiv.style.width = "100vw";
	// drumDiv.style.height = "100vh";
	// drumDiv.style.transform = "scale(0.4) translate(-70%, -60%)";
	// drumDiv.style.transform = "scale(1) translate(10%, 0%)";
	scaleAndPosition(drumDiv, 20, 10, 0.8);



	// keyboardDiv.style.top = "100vw";
	// keyboardDiv.style.left = "28vw";
	// keyboardDiv.style.height = "25vw";

	// keyboardDiv.style.transform = "scale(0.4) translate(-20%, 20%)";
	// keyboardDiv.style.opacity = 0.0;

	// deleteAllKeyElements();
	// buildKeyboard(3);
	// addVolumeEventSquares();
	// scaleAndPosition(keyboardDiv, -40, 30, 1.5);


	cursorImage.style.width = "10vw"
	studioDiv.style.display = "none";
	setBeatTime(300);
}


function initS1Loops()
{
	let drumNotes = ['kick','hat','snare','hat','kick','hat','snare'];
	let pianoNotes = ['p3','p2','p1','p2','p3','p3','p3'];
	for(let i = 0; i < drumNotes.length; i++)
	{
		// let timeFromStart = i * beatTime;
		drumTrackS1.addNote(drumNotes[i], i, 300);
		pianoTrackS1.addNote(pianoNotes[i], i, 300);
	}
}

function addNotesToTrack(track, noteList)
{
	for(let i = 0; i < noteList.length; i++)
	{
		// let timeFromStart = i * beatTime;//notes need times ['p1', 1.5]
		track.addNote(noteList[i], i, 300); //duration = noteList[i][1]
	}
}

//TODO: if string playing, restart (api create new source)
function animateAndPlaySound(soundName, delay, duration, stringNumber)
{
	//always playSound/animate
	animate(soundName, delay);

	if(duration != null)
	{
		setTimeout(function()
		{
			unAnimate(soundName);
		}, delay + duration);
	}

	if(testingLocal)
	{
		setTimeout(function()
		{
			playSoundLocal(soundName, duration);
		},delay);
	}
	else
	{
		// playSound(getBufferByName(soundName), delay, stringNumber, soundName);
		playSound(soundName, delay, duration, stringNumber);
	}
}

function initTap(eventType)
{
	//add event listeners
	// let allDrums = ['kick', 'hat', 'snare'];
	tap('hat');
	// animateAndPlaySound('hat');
	console.log(eventType);
	for(let i = 0; i < allDrums.length; i++)
	{
		let id = allDrums[i];
		let drum = document.querySelector('#'+id);
		if(eventType == 'mouse')
		{
			drum.onmousedown = function()
			{
				tap(id);
			}
		}
		else if(eventType == 'touch')
		{
			isTouchScreen = true;
			drum.ontouchstart = function(evt)
			{
				tap(id);
				evt.preventDefault();
			}
		}
	}
	deleteAllKeyElements();
	buildKeyboard(3);
	addVolumeEventSquares();
	scaleAndPosition(keyboardDiv, -40, 30, 1.5);
}

//Run everytime a letter is tapped/clicked
//TODO: stageOneTap(soundName);
function tap(soundName, stringNumber)
{
	let loadSoundDelay = 100;//this wasnt the problem? try higher?
	let string = -1;
	if(typeof stringNumber !== "undefined")
	{
		string = stringNumber;
	}
	// console.log(soundName);
	if(!testingLocal && !checkAudioInit())
	{
		initApi();
		animateAndPlaySound(soundName, loadSoundDelay, null, string);
	}
	else
	{
		animateAndPlaySound(soundName, 0, null, string);
	}

	if(stage == STUDIO)//should be ==STAGE -> stageXTap(soundName)
	{
		//should be on stopsound or at end of loop (for now)
		recordTap(soundName);
	}
	else if(stage == INTRO)
	{
		stage1Tap(soundName);
	}
	else if(stage == QUICK)
	{
		if(inputEnabled)//dont play key at all?
		{
			if(quickMode == 'play')
			{
				// quickModeTap(soundName);
				playQuickTap(soundName);
			}
			else if(quickMode == 'learn')
			{
				learnQuickTap(soundName);
			}
		}
	}
}
let record = [];
let isFirstTap = true;
let scoreTimer;
let scoreStartTime;
function playQuickTap(soundName)
{
	currentNote = currentRiff.notes[riffProgress].soundName;//optionn to be a track
	record.push(soundName);
	let isCorrectTap = (soundName == currentNote);
	if(isCorrectTap)
	{
		riffProgress++;
		updateProgressBar();
		// if(riffProgress == 0)
		// quickTapCount++;
		if(isFirstTap)
		{
			isFirstTap = false;
			startTimer();
		}
	}
	else
	{
		wrongNoteCount++;
		// helpText.innerHTML = wrongNoteCount;
	}



	if(riffProgress == currentRiff.notes.length)
	{
		riffProgress = 0;
		currentRifNumber++;
		if(currentRifNumber == allRiffs.length)
		{
			//all riffs complete
			currentRifNumber = 0;
			isFirstTap = true;
			clearInterval(scoreTimer);
			let thisTime = new Date().getTime();
			// display time taken
			let timePassed = Math.floor(thisTime - scoreStartTime)/1000;
			let roundedTime = timePassed.toFixed(2);
			// helpText.innerHTML = "Your time: "+Math.floor((thisTime - scoreStartTime)/1000)+"s / "+wrongNoteCount+" wrong notes.";
			helpText.innerHTML = "Your time: "+roundedTime+"s / "+wrongNoteCount+" wrong notes.";

			wrongNoteCount = 0;
		}
		currentRiff = allRiffs[currentRifNumber];
	}
	updateThreeKeys();
}

function startTimer()
{
	helpText.innerHTML = 0+'s';
	scoreStartTime = new Date().getTime();
	scoreTimer = setInterval(function()
	{
		let thisTime = new Date().getTime();
		helpText.innerHTML = Math.floor((thisTime - scoreStartTime)/100)/10+'s';
		//need check for if over allowed time
		// helpText.innerHTML = Math.floor((thisTime - scoreStartTime)/1000)+'s';
	}, 100);//change to 100?
}

function updateProgressBar()
{
	let progress = riffProgress/currentRiff.notes.length;
	if(progress == 1) progress = 0;
	document.querySelector('#progressBar').style.width = progress*100+'vw';
	document.querySelector('#progressBar').style.borderRight = 'solid gray '+((1-progress)*100)+'vw';
}

function restartRiffs()
{
	isFirstTap = true;
	clearInterval(scoreTimer);
	helpText.innerHTML = "Play first key to start timer";
	currentRifNumber = 0;
	currentRiff = allRiffs[currentRifNumber];
	riffProgress = 0;
	wrongNoteCount = 0;
	phaseStart = 0;
	unhighlightPiano();
	updateThreeKeys();
	updateProgressBar();
}

function unhighlightPiano()
{
	let allWhiteKeysDom = document.querySelectorAll('.whiteKey');
	// let allWhiteKeys = [...allWhiteKeysDom];//convert to normal array
	allWhiteKeysDom.forEach(key => key.src = 'images/whiteKey.png');
}

// function quickModeTap(soundName)
function learnQuickTap(soundName)
{

	riffProgress++;
	// currentNote = randomTrack.notes[quickTapCount-1].soundName;
	currentNote = currentRiff.notes[riffProgress-1].soundName;
	let isCorrectTap = (soundName == currentNote);
	if(isCorrectTap)
	{
		isFirstTap = (riffProgress == phaseStart);
		//if first tap of phase, start timer
		if(isFirstTap) startTimer();
		// console.log('correct');
		// if(quickTapCount == randomTrack.notes.length)
		// if(riffProgress == (phasePos+1)*phaseSize)//end of phase

		//check if end of whole riff/song
		if(riffProgress == currentRiff.notes.length)
		{
			riffProgress = 0;
			phasePos = 0;
			thisPhaseSize = currentRiff.phaseLengths[phasePos];
			phaseStart = phasePos*thisPhaseSize;
			clearInterval(scoreTimer);
			helpText.innerHTML = 'Song complete.';

		}
		else
		{
			if(riffProgress == (phasePos+1)*thisPhaseSize)//end of phase
			{
				songProgress += thisPhaseSize;
				phasePos++;
				thisPhaseSize = currentRiff.phaseLengths[phasePos];

				// phaseStart = phasePos*thisPhaseSize;
				phaseStart = songProgress;
							//wrong, should be all previous notes added

				// phaseStart = phasePos*phaseSize;
				clearInterval(scoreTimer);
				helpText.innerHTML = 'listen';
				setTimeout(function()
				{
					// createOneRandomPhase(5);
					playPhaseAndDisableInput();
					// createCloseRandomPhase(5);
					// currentRiff.queueSomeNotes(phaseStart, phaseStart+thisPhaseSize, 0);
					// currentRiff.queueAllNotes(0);
				}, 600);
			}
			// quickTapCount = 0;
			updateThreeKeys();
			updateProgressBar();
		}

	}
	else//wrong note
	{
		clearInterval(scoreTimer);
		unhighlightPiano();
		helpText.innerHTML = 'listen';
		riffProgress = phaseStart;
		songProgress = phaseStart;
		setTimeout(function()
		{
			// currentRiff.queueAllNotes(0);
			playPhaseAndDisableInput();
			// currentRiff.queueSomeNotes(phaseStart, phaseStart+thisPhaseSize, 0);
		}, 600);
	}
}

function playPhaseAndDisableInput()
{
	currentRiff.queueSomeNotes(phaseStart, phaseStart+thisPhaseSize, 0);
	inputEnabled = false;
	let lastNoteThisPhase = currentRiff.notes[songProgress+thisPhaseSize-1];
	let lastNotePreviousPhase = currentRiff.notes[songProgress];
	//time to wait = length of current phase = time of last note of current phase
	// let lastNoteTime = currentRiff.notes[phasePos(phasePos+thisPhaseSize)-1].beatsFromStart*beatTime;
	let lastNoteTime = (lastNoteThisPhase.beatsFromStart - lastNotePreviousPhase.beatsFromStart) * beatTime;
	//
	setTimeout(function()
	{
		inputEnabled = true;
		console.log('input enabled');
		helpText.innerHTML = 'Go!';
	}, lastNoteTime);//needs to be last note of phase
}

function stage1Tap(soundName)
{
	// currentNote = notesInOrder[clickNumber-1];
	if(isInitTap)
	{
		//check tap or click
	}
	clickNumber++;// need add check for correct letter aswel
	currentNote = notesAndPhases[phaseNumber][clickNumber-1];
	let currentPhase = notesAndPhases[phaseNumber];
	let phaseDelay = 1000;

	let isCorrectTap = (soundName == currentNote);
	if(!isCorrectTap && !stageComplete && stage != STUDIO)
	{
		//replays last phase for listening
		wrongNote();//subtracts 1 from clickNumber
	}
	else //correct hit
	{
		correctTaps++;
		let passedCurrentPhase = (clickNumber == currentPhase.length);

		// if(correctTaps == 1)
		if(phaseNumber == 0 && stage!=STUDIO)
		{
			setTimeout(showSnare, 800);
			phaseDelay = 800;
			// playSoundLocal('hat');

			// drumsToBack();
		}
		else if(phaseNumber == 1)
		{
			setTimeout(showKick, 800);
			phaseDelay = 800;
		}
		else if(phaseNumber == 2)
		{
			setTimeout(threeInARow, 450);//need check if all 3 played on s
			phaseDelay = 450;
		}
		// else if(correctTaps == 6)
		else if(phaseNumber == 3 && passedCurrentPhase)
		{
			helpText.innerHTML = "NICE!!!!";
			// helpText.style.left = "58vw";
			setTimeout(function(){
				helpText.innerHTML = "Listen...";
				// helpText.style.top = "36vw";
				helpText.style.left = "8vw";
				helpText.style.transform = "rotate(-15deg)";
				// setTimeout(firstBeat, 1000);
			}, 1000);
			phaseDelay = 2000;
		}
		else if(phaseNumber == 6  && passedCurrentPhase)//when drums correct
		{
			initStageTwo();
			phaseDelay = 10*beatTime;
		}
		else if(phaseNumber >= 7) //all piano phases
		{
			let loopTime = beatTime*8;
			let timeSinceLoopStart = new Date().getTime() - loopStartTime;
			let measures = timeSinceLoopStart/(beatTime*8);
			let timeThisLoop = measures - Math.floor(measures);

			phaseDelay = beatTime*8 - timeThisLoop*beatTime*8;
			//time until next loopstart
		}

		// if(correctTaps == currentPhase.length)
		if(passedCurrentPhase)
		{
			//advance
			// console.log('new phase');
			if(phaseNumber == notesAndPhases.length-1)//stage complete
			{
				stageComplete = true;
				// console.log('all phases complete');
				helpText.innerHTML = "Level 2: Hotkeys"; //press Q W E
				//left hand qwe, right hand on jkl (iop better?)
				helpText.style.left = "40vw";
				helpText.style.top = "40vw";
				helpText.style.transform = "rotate(0deg)";

				// keyboardDiv.style.top = "11vw";
				// keyboardDiv.style.left = "58vw";
				scaleAndPosition(keyboardDiv, 15, 25, 1);
				scaleAndPosition(drumDiv, 50, 15, 0.5);


				// keyboardDiv.style.height = "vw";

				// document.getElementById("studioTrain").style.display = "block";
				// keyboardDiv.style.transform = "rotate(15deg)";

				//always loop last phase when stage complete
				loopPhase(notesAndPhases.length-1, phaseDelay);
				setTimeout(clearLoopTimers, beatTime*9);
				// playPhase(notesAndPhases.length-1, phaseDelay);
			}
			else
			{
				playNextPhase(phaseDelay);
			}
		}
	}
}

let eShape = [0, 2, 2, 1, 0, 0];
let aShape = [0, 0, 2, 2, 2, 0];
let emShape = [0, 2, 2, 0, 0, 0];
let barShape = aShape;
let barPosition = 5;
function stringTap(stringNumber, isStrum)
{
	let soundName = getSoundFromStringId(stringNumber); //need getSoundFromStringId?
	if(!fretHandDown)
	{
		soundName = "g"+stringNumber+"0";
	}
	playingStrings.push(stringNumber);
	if(leftMouseDown || isStrum)
	{
		tap(soundName, stringNumber);
		animateStringFinger(stringNumber);
	}
}

function animateStringFinger(stringNumber)
{
	if(stringNumber == 1 || stringNumber == 2)
	{
		document.querySelector('#stringThumb').src = 'images/stringThumbDown.png';
		setTimeout(function()
		{
			document.querySelector('#stringThumb').src = 'images/stringThumb.png';
		}, 200);
	}
	else if(stringNumber == 3)
	{
		document.querySelector('#stringIndex').src = 'images/stringIndexDown.png';
		setTimeout(function()
		{
			document.querySelector('#stringIndex').src = 'images/stringIndex.png';
		}, 200);
	}
	else if(stringNumber == 4)
	{
		document.querySelector('#stringMiddle').src = 'images/stringMiddleDown.png';
		setTimeout(function()
		{
			document.querySelector('#stringMiddle').src = 'images/stringMiddle.png';
		}, 200);
	}
	else if(stringNumber == 5)
	{
		document.querySelector('#stringRing').src = 'images/stringRingDown.png';
		setTimeout(function()
		{
			document.querySelector('#stringRing').src = 'images/stringRing.png';
		}, 200);
	}
}

//NOTE: will need sb0 eventually,
function checkStringTap(event)
{
	let stringNumber = parseInt(event.target.id.charAt(2));
	let enterDirection = checkEnterDirection(event);
	if(leftMouseDown)
	{
		if(enterDirection == "bottom" && stringNumber != 4)
		{
			// stringNumber++;
			stringTap(stringNumber+1);//remove +1 when string 0 is here
		}
		else if(enterDirection == "top" && stringNumber != 1)//will be 0
		{
			stringNumber--;
			stringTap(stringNumber+1);
		}
	}
}

function checkEnterDirection(event)
{
	let elem = event.target;
	var elemBounding = elem.getBoundingClientRect();

  var elementLeftEdge = elemBounding.left;
  var elementTopEdge = elemBounding.top;
  var elementRightEdge = elemBounding.right;
  var elementBottomEdge = elemBounding.bottom;

	var topEdgeDist = Math.abs(elementTopEdge - mouseY);
  var bottomEdgeDist = Math.abs(elementBottomEdge - mouseY);
  var leftEdgeDist = Math.abs(elementLeftEdge - mouseX);
  var rightEdgeDist = Math.abs(elementRightEdge - mouseX);

	var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);

	switch (min) {
		case leftEdgeDist:
			return "left";
		case rightEdgeDist:
			return "right";
		case topEdgeDist:
			return "top";
		case bottomEdgeDist:
			return "bottom";
	}
}

function getSoundFromStringId(stringNumber)
{
	let fingerFret = barShape[stringNumber-1] + barPosition;
	return soundName = "g"+stringNumber+fingerFret; //need getSoundFromStringId?
}
//up 1, down -1
//TODO: zstrings/range
function strum(direction, stringDelay)
{
	//tap all strings in order
	let startString = 2;
	let pickDelay = 0;
	playingStrings = [];
	if(direction < 0)
	{
		startString = 5;
	}
	//
	for(let i = startString; i <= 5; i = i+direction)//only strings 2 to 4 for now
	{
		setTimeout(function(){
			playingStrings.push(i);
			stringTap(i, true);
		}, pickDelay);
		pickDelay += stringDelay;
		if(direction < 0 && i < 3)
		{
			break;
		}
	}
	// setTimeout(function()
	// {
	// 	document.querySelector('#stringThumb').src = 'images/stringThumb.png';
	// 	document.querySelector('#stringIndex').src = 'images/stringIndex.png';
	// 	document.querySelector('#stringMiddle').src = 'images/stringMiddle.png';
	// 	document.querySelector('#stringRing').src = 'images/stringRing.png';
	// }, 200);
}

function getVolumeFromSoundName(soundName)
{
	let volume = 1.0;
	if(soundName.charAt(0) == 'p')
	{
		volume = pianoVolume;
	}
	else if(soundName.charAt(0) == 'g')
	{
		volume = guitarVolume;
	}
	return volume;
}

function startVolumeDrag(instrument)
{
	isDraggingVolume = true;
	volumeInstrument = instrument;
	volumeDragStart = event.clientY;
	cursorImage.style.transformOrigin = '19% 27%';
	//need to set left and top to correct knob position
}

function moveVolumeKnob(pixelsMoved)
{
	//update rotation and instrument volume
	let currentRotation;
	if(volumeInstrument == 'guitar') currentRotation = guitarVolume/0.2*260-130;
	if(volumeInstrument == 'keyboard') currentRotation = pianoVolume/1*260-130;
	// need to add to currentVolume rotation
	let rotation = pixelsMoved/windowWidth*10*40; //should be based on screen width
	let newRotation = currentRotation+rotation;
	if(newRotation > 130) newRotation = 130;
	if(newRotation < -130) newRotation = -130;
	//w/ instrument class could be volumeInstrument.volume = aksljasldkaj
	if(volumeInstrument == 'guitar') guitarVolume = (newRotation+130)/260*0.2;
	if(volumeInstrument == 'keyboard') pianoVolume = (newRotation+130)/260;

	//should start from 0 degrees always
		//need to store drag start volume
		//current - start degrees, if start was 30, new is 130, 100, 30 new is -100, -130?
	// if(isDraggingVolume)
	// {
	// 	if(volumeInstrument == 'guitar') cursorImage.style.transform = 'rotate('+guitarRotation+'deg)';
	// 	if(volumeInstrument == 'keyboard') cursorImage.style.transform = 'rotate('+keyboardRotation+'deg)';
	// }
	cursorImage.style.transform = 'rotate('+currentRotation+'deg)';

	refreshVolumeKnobs();
}

//updates knob based on volume
// function refreshVolumeKnob(rotation)
function refreshVolumeKnobs()
{
	let guitarRotation = guitarVolume/0.2*260-130;
	document.querySelector('#knobTop').style.transform = 'rotate('+guitarRotation+'deg)';
	let keyboardRotation = pianoVolume*260-130;
	document.querySelector('#keyVol').style.transform = 'rotate('+keyboardRotation+'deg)';

}

function cursorToPinchHand()
{
	cursorImage.src = "images/pinchCursor.png";
	//
	// cursorImage.style.left = ;
}

function cursorToNormal()
{
	if(!isDraggingVolume)
	{
		cursorImage.src = "images/cursor.png";
	}
}


function addVolumeEventSquares()
{
	//delete previous ones
	document.querySelectorAll('.eventDiv').forEach((div) => div.parentNode.removeChild(div));
	//get all knobs
	let allKnobs = document.querySelectorAll('.knob');
	//make squares triple width, above knobs
	allKnobs.forEach((knob) =>
	{
		let eventDiv = document.createElement('DIV');
		// eventDiv.style.backgroundColor = 'gray';
		eventDiv.style.position = 'absolute';
		eventDiv.style.zIndex = '10';
		eventDiv.classList.add('eventDiv');
		let knobRect = knob.getBoundingClientRect();
		let parentLeft = knob.parentNode.getBoundingClientRect().left;
		let parentTop = knob.parentNode.getBoundingClientRect().top;
		let eventWidth = knobRect.width;
		let eventHeight =	knobRect.height;
		// let eventHeight =	0.02*windowWidth;
		eventDiv.style.width = eventWidth+'px';
		eventDiv.style.height = eventHeight+'px'; //needs to be based on cursor size
		eventDiv.style.top = knobRect.top-parentTop-0.8*eventHeight+'px';
		eventDiv.style.left = knobRect.left+(0.5*knobRect.width)-(0.1*eventWidth)-parentLeft+'px';
		// onmousedown="startVolumeDrag('keyboard')"
		// onmouseenter='cursorToPinchHand()'
		// onmouseleave='cursorToNormal()'
		let instrumentId;
		if(knob.parentNode.id.includes('guitar')) instrumentId = 'guitar';
		if(knob.parentNode.id.includes('keyboard')) instrumentId = 'keyboard';

		eventDiv.onmousedown = (event) => startVolumeDrag(instrumentId);

		// eventDiv.onmousedown = function(event)
		// {
		// 	startVolumeDrag(instrumentId);
		// }
		eventDiv.onmouseenter = function(event)
		{
			cursorToPinchHand();
		}
		eventDiv.onmouseleave = function(event)
		{
			if(!isDraggingVolume)
			{
				cursorToNormal();
			}
		}

		knob.parentNode.appendChild(eventDiv);
	});
	//add event listeners to these
}

//shape E, bar 0, string1
//0, 2, 2, 1, 0, 0
//so ba
function initStageTwo()
{
	helpText.innerHTML = "Too easy!";
	setTimeout(function()
	{
		// snare.style.opacity = "1";
		// kick.style.opacity = "1";
		// clickNumber = 13;
		correctTaps = 21;
		phaseNumber = 7;
		// playPhase(5, 8*beatTime);//first piano key
		// loopFirstBeat();
		setTimeout(function()
		{
			document.getElementById('p3').src = "images/whiteKeyHighlighted.png";
				// checkPoint = 2;
		}, 8*beatTime+300);

		// playPhase(4, 0);
		if(testingLocal)
		{
			loopPhase(6, 0);
		}
		else
		{
			loopTrack(drumTrackS1, 0);
		}

		loopStartTime = new Date().getTime();
		// drumsToBack();
		scaleAndPosition(drumDiv, 60, 5, 0.5);
		scaleAndPosition(keyboardDiv, 10, 30, 1.5);

		keyboardDiv.style.opacity = 1;
		// scaleAndPosition(keyboardDiv, 10, 10, 1);


		// keyboardDiv.style.top = "15vw";
		// cursorImage.style.width = "15vw";
		setTimeout(function()
		{
			helpText.style.left = "5vw";
			setTimeout(function()
			{
				// helpText.innerHTML = "Press This!";
				helpText.style.opacity = "0";
				helpText.style.top = "30vw";
				setTimeout(function()
				{
					setTimeout(function()
					{
						helpText.innerHTML = "Press This!";
						helpText.style.opacity = "1";
						//show arrow
					},1000);
				},1000);
			},1000);
		}, 500);
	}, 2*beatTime);
}

// var keyboardNotes =
// [
// 	['p3'],
// 	['p3','p2','p1'],
// 	['p3','p2','p1','p2','p3'],
// 	['p3','p2','p1','p2','p3','p3','p3']
// ];

// 'p3','p3','p2','p1','p3','p2','p1','p2','p3']
//need to wait till start of measure
function playNextPhase(phaseDelay)
{
	phaseNumber++;
	playPhase(phaseNumber, phaseDelay);
	//after playing phase, allow user to try
	clickNumber = 0;
}

function playPhase(phaseId, phaseDelay)
{
	let phaseNotes = notesAndPhases[phaseId];
	// let phaseNotes = keyboardNotes[phaseNumber];
	for(let i = 0; i < phaseNotes.length; i++)
	{
		let delay = i*beatTime;
		let soundName = phaseNotes[i];
		animateAndPlaySound(soundName, phaseDelay+delay, 200); //need note times in array
		if(testingLocal)
		{
			// setTimeout(function()
			// {
			// 	stopSound(soundName);
			// }, 250+phaseDelay+delay);
		}
	}
}

function loopPhase(phaseId, delayLoop)
{
	let phaseNotes = notesAndPhases[phaseId];
	playPhase(phaseId, delayLoop);
	//interval needs to check whether to keep adding to the api list
	// 		twice a second,
	loopTimer = setInterval(function()
	{
		for(let notePosition = 0; notePosition < phaseNotes.length; notePosition++)
		{
			let delay = notePosition*beatTime;
			animateAndPlaySound(phaseNotes[notePosition], delay+delayLoop, 200);
			// playSound(getBufferByName(notesInOrder[notePosition]), timeFromLoopStart);
		}
	},phaseNotes.length*beatTime+beatTime-1);//add one beat (notTiming)
	loopTimers.push(loopTimer);
}

function loopRandomTrack(track, delay)
{
	track.queueAllNotes(delay);
	let wholeLoopTime = track.getLastNoteTime();//will need to find closest measure
	let loopTest = roundUpToNearestMeasure(wholeLoopTime);
	console.log(loopTest);
	loopTimer = setInterval(function()
	{
		track.queueAllNotes(delay);
	// }, wholeLoopTime+beatTime);
	}, roundUpToNearestMeasure(wholeLoopTime));
	loopTimers.push(loopTimer);
}

function loopTrack(track, delayLoop)
{
	track.queueAllNotes(delayLoop);
	loopTimer = setInterval(function()
	{
		track.queueAllNotes(delayLoop);
	},8*beatTime);
	loopTimers.push(loopTimer);
}

// //Improved scheduling,
// //TODO: take measure
// function loopTrack(track, delayLoop)
// {
// 	let playLag = 200;
// 	track.queueAllNotes(playLag);//delay loop so interval can check first
// 	let loopStart = getAudioContext().currentTime*1000+playLag;
// 	// let loopStart = new Date().getTime()+playLag;
// 	let loopLength = 8*beatTime;
// 	loopTimer = setInterval(function()
// 	{
// 		let timeSinceLoopStart = getAudioContext().currentTime*1000 - loopStart;
// 		let timeTillNextLoop = (loopLength - timeSinceLoopStart);
// 		track.queueAllNotes(timeTillNextLoop);
// 		console.log(timeTillNextLoop, loopLength, timeSinceLoopStart);
// 		loopStart = getAudioContext().currentTime*1000 + timeTillNextLoop;
// 	}, loopLength);
// 	return loopStart;
// }

let startLoopPosition = 6;
let endLoopPosition = 13;

function bringBassLettersIn()
{
	u.style.opacity = "1";
	u.style.display = "block";
	i.style.opacity = "1";
	i.style.display = "block";
	o.style.opacity = "1";
	o.style.display = "block";
	p.style.opacity = "1";
	p.style.display = "block";
}

function drumsToBack()
{
	// drumDiv.style.width = "40vw";
	// drumDiv.style.height = "40vh";
	// drumDiv.style.top = "2vw";
	// drumDiv.style.left = "50vw";
	drumDiv.style.transform = "scale(0.4) translate(90%, -50%)";

}

function moveLettersToBack()
{
	a.style.left = "0";
	a.style.top = "3vw";
	a.style.height = "10vw";
	a.style.opacity = "0.5";

	w.style.left = "12vw";
	w.style.height = "10vw";
	w.style.opacity = "0.5";

	s.style.left = "24vw";
	s.style.top = "3vw";
	s.style.height = "10vw";
	s.style.opacity = "0.5";

}
//will take loop length and notes
// function loop()
// {
	// noteCount = -1;
	// firstBeat();


// }

//maybe should take keyboard height
function buildKeyboard(numKeys)
{
	keyboardDiv.style.transform = ''; //scale messes with everything
	whiteKeyNum = numKeys;
	allPianoNotes = [];
	blackKeys = [];
	// numKeys = 5;
	// keyboardRight.style.left = (numKeys-3)*22-2+'%';
	//get keyboard height
	let numInOctave = 0;
	let boardHeight = keyboardDiv.getBoundingClientRect().height;
	// windowWidth = 1528;
	let heightInVw = boardHeight/windowWidth*100;
	// console.log(heightInVw, boardHeight);
	let minWidth = 1.06*boardHeight;
	let keyWidth = (0.24*boardHeight);
	let addedWidth = (numKeys-3)*keyWidth;
	keyboardDiv.style.width = (minWidth+addedWidth+keyWidth)/windowWidth*100+0.2*heightInVw+'vw';
	keyboardMid.style.width = (numKeys-3+1)*keyWidth/windowWidth*100+'vw';//should take
	//position volume knob, pecentage of height
	document.querySelector('#keyVol').style.left = 0.1*boardHeight+'px';
	//insert another middle portion, or increase width
	//add x white keys, spaced @x%, add appropriate classes
	for(let i = 0; i < numKeys; i++)
	{
		let leftPos = 0.22*heightInVw+i*0.24*heightInVw;
		// console.log(leftPos);
		let keyElement = document.createElement("IMG");
		let keyId = "p"+(i+1);
		allPianoNotes.push(keyId);
		// keyElement.style.left = leftPos+"%";
		keyElement.style.left = leftPos+"vw";
		if(!isTouchScreen)
		{
			keyElement.onmousedown = function(event)
			{
				tap(keyId);
			}
			keyElement.onmouseup = function(event)
			{
				// stopSoundLocal(keyId);
				stopSound(keyId);
				saveNoteToTrack(keyId);
				// resetPianoKey(keyId);

				// document.getElementById(keyId).src = "images/whiteKey.png";
			}
			keyElement.onmouseenter = function(event)
			{
				if(leftMouseDown)
				{
					tap(keyId);
				}
			}
			keyElement.onmouseleave = function(event)
			{
				//will be same as mouse up code i.e. stop sound
				// stopSoundLocal(keyId);
				if(leftMouseDown)
				{
					stopSound(keyId);
					saveNoteToTrack(keyId);
					// resetPianoKey(keyId);
					// document.getElementById(keyId).src = "images/whiteKey.png";
				}
			}
		}
		else
		{
			keyElement.ontouchstart = function(evt)
			{
				tap(keyId);
				evt.preventDefault();
			}
			keyElement.ontouchend = function(evt)
			{
				stopSound(keyId);
				saveNoteToTrack(keyId);
				evt.preventDefault();
			}
			// keyElement.onmouseenter = function(event)
			// {
			// 	if(leftMouseDown)
			// 	{
			// 		tap(keyId);
			// 	}
			// }
			// keyElement.onmouseleave = function(event)
			// {
			// 	//will be same as mouse up code i.e. stop sound
			// 	// stopSoundLocal(keyId);
			// 	if(leftMouseDown)
			// 	{
			// 		stopSound(keyId);
			// 		saveNoteToTrack(keyId);
			// 		// resetPianoKey(keyId);
			// 		// document.getElementById(keyId).src = "images/whiteKey.png";
			// 	}
			// }
		}



		let keyBg = keyElement.cloneNode(true);
		keyElement.id = keyId;
		// allPianoNotes.push(keyId);

		keyElement.classList.add("whiteKey");
		keyElement.src = "images/whiteKey.png";
		keyBg.classList.add("whiteKeyBg");
		keyBg.src = "images/whiteKeyBg.png";

		document.getElementById('keyboardDiv').appendChild(keyBg);
		document.getElementById('keyboardDiv').appendChild(keyElement);
		// createHotkey(whiteKeyHotkeys[i], keyId, 0.05, 0.8);

		//black keys
		if(numInOctave != 2 && numInOctave != 6 && i < numKeys-1)
		{
			// let leftBlackPos = 19.8+i*15.2;
			// let leftPos = 0.20*heightInVw+i*0.24*heightInVw;
			blackKeyNum++;
			let leftBlackPos = 0.35*heightInVw+i*0.24*heightInVw;

			let blackKeyElement = document.createElement("IMG");
			let blackKeyId = "pb"+(i+1);
			allPianoNotes.push(blackKeyId);

			blackKeyElement.style.left = leftBlackPos+"vw";

			if(!isTouchScreen)
			{
				blackKeyElement.onmousedown = function(event)
				{
					//move element down x, and return after a time
					// whiteKeyPressed(event.target);
					tap(blackKeyId);
				}
				blackKeyElement.onmouseup = function(event)
				{
					// stopSoundLocal(keyId);
					stopSound(blackKeyId);
					saveNoteToTrack(blackKeyId);
					// resetPianoKey(blackKeyId);

					// blackKeyElement.src = "images/blackKey.png";
				}
				blackKeyElement.onmouseenter = function(event)
				{
					if(leftMouseDown)
					{
						tap(blackKeyId);
					}

				}
				blackKeyElement.onmouseleave = function(event)
				{
					//will be same as mouse up code
					if(leftMouseDown)
					{
						stopSound(blackKeyId);
						saveNoteToTrack(blackKeyId);
						// resetPianoKey(blackKeyId);

						// blackKeyElement.src = "images/blackKey.png";
					}
				}
			}
			else //touchscreen events
			{
				blackKeyElement.ontouchstart = function(evt)
				{
					tap(blackKeyId);
					evt.preventDefault();
				}
				blackKeyElement.ontouchend = function(evt)
				{
					stopSound(blackKeyId);
					saveNoteToTrack(blackKeyId);
					evt.preventDefault();
				}
			}
			let blackKeyBg = blackKeyElement.cloneNode(true);
			blackKeyElement.id = blackKeyId;

			blackKeyElement.classList.add("blackKey");
			blackKeyElement.src = "images/blackKey.png";
			blackKeyBg.classList.add("blackKeyBg");
			blackKeyBg.src = "images/blackKeyBg.png";
			//should be .push([blackKeyElement, blackKeyBg]);
			blackKeys.push([blackKeyBg, blackKeyElement])
			// blackKeys.push(blackKeyBg);
			// blackKeys.push(blackKeyElement);
		}

		if(numInOctave == 7) //0-7
		{
			numInOctave = 0;
		}
		numInOctave++;
	}

	//have to add all black keys on top of white
	for(let i = 0; i < blackKeys.length; i++)
	{
		let blackKeyEl = blackKeys[i][1];
		let blackKeyBgEl = blackKeys[i][0];
		// let blackKeyEl = blackKeys[i];
		// let blackKeyBgEl = blackKeys[i+1];
		document.getElementById('keyboardDiv').appendChild(blackKeyBgEl);
		document.getElementById('keyboardDiv').appendChild(blackKeyEl);
		// document.getElementById('keyboardDiv').appendChild(blackKeyBg);
		// document.getElementById('keyboardDiv').appendChild(blackKeyElement);
	}
}

function deleteAllKeyElements()
{
	//whiteKey, whiteKeyBg, blackKey, blackKeyBg
	let allKeys = document.querySelectorAll('.whiteKey, .whiteKeyBg, .blackKey, .blackKeyBg');
	allKeys.forEach((key) => keyboardDiv.removeChild(key));
}

function wrongNote()
{
	// clickNumber--; //will go back to 7 for full drums
	clickNumber = 0;
	//display "try again"
	playPhase(phaseNumber, 500);
	//need to disable user tap while phase playing
	helpText.innerHTML = "Try again";
}

//3x s hits
function threeInARow()
{
	var x = 0;
	helpText.style.opacity = "1";

	helpText.innerHTML = "3 in a ROW!";
	helpText.style.left = "58vw";
}


//kick, cymbal, kick, snare, kick, kick
// w s a s w s a
//need to store songs as a list, [time, note]
function firstBeat()
{
	var beat = setInterval(function()
	{
		noteCount++;
		if(noteCount > 6)
		{
			clearInterval(beat);
			textToGo();
		}
		else
		{
			animate(notesInOrder[noteCount+6]);
		}
	}, beatTime);
}

var bassTiming = [220,830,300,1050,220,830,300];
//223 834 307 1054 225 836 308 //what times it actually ran

// var bassTiming = [300,900,300,1200,300,900,300];
// var bassTiming = [150,950,300,1000,150,1000,300];
function bassLine()
{
	//play first note
	//play next note with delay from bassTiming

	noteCount = -1;
	animate('u');
	noteCount++;
	playNextNote();
}

function playNextNote()
{
	// console.log(noteCount +"and "+bassTiming[noteCount] + notesInOrder[noteCount+13])
	// thisTime = new Date().getTime()
	// console.log(thisTime - lastTime);
	// lastTime = thisTime;
	//todo: stop at last note
	setTimeout(function(){
		animate(notesInOrder[noteCount+13]);
		playNextNote();
	}, bassTiming[noteCount]);
	noteCount++;
}

function textToGo()
{
	helpText.innerHTML = "GO!";
}

// var looping;
//take type of animation?
//   spin, shake, press (get top and -x from it)
function animate(soundName, delay)
{
	//DRUMS
	let animationDelay = 0;
	if(delay != null)
	{
		 animationDelay = delay;
	}
	setTimeout(function()
	{
		if(soundName == 'hat')
		{
			smallSpin(soundName, 5);
		}
		else if (soundName == 'kick') {
			shakeY(soundName, -5);
		}
		else if (soundName == 'snare') {
			shakeY(soundName, 5);
		}
	}, animationDelay);

	//PIANO
	let element = document.getElementById(soundName);
	let to, from;
	if(soundName.charAt(0) == 'p')
	{
		setTimeout(function()
		{
			if(soundName.charAt(1) != 'b')//white keys
			{
				to = 44;
				if(!threeToShow.includes(soundName))//should be currentRiff[riffProgress+123  etc?]
				{
					if(highlightKeys) element.src = "images/whiteKeyHighlighted.png";
					setTimeout(function()
					{
						 if(stage == QUICK)
						 {
							 updateThreeKeys();
						 }
					}, 200);
				}
			}
			else//black keys
			{
				to = 39;
				if(!threeToShow.includes(soundName))
				{
					if(highlightKeys) element.src = "images/blackKeyHighlighted.png";
					setTimeout(function()
					{
						// element.src = "images/blackKey.png";
						if(stage == QUICK)
						{
							updateThreeKeys();
						}
					}, 200);
				}
			}
			element.style.top = to+'%';
			// setTimeout(function()
			// {
			// 	element.style.top = from+'%';
			// }, 100);
		}, delay);
	}
}

function updateCursorImage(event)
{
	// let adjustedLeft = event.clientX-0.045*document.body.clientWidth;
	// let adjustedTop = event.clientY-0.02*document.body.clientHeight;
	let pixelWidth;
	let stringWidth = cursorImage.style.width;
	if(stringWidth.length == 3)//e.g. "5vw"
	{
		pixelWidth = parseInt(stringWidth.charAt(0));
	}
	else if(stringWidth.length == 4)//e.g. "15vw"
	{
		pixelWidth = parseInt(stringWidth.substring(0, 2));
	}

	pixelWidth *= document.body.clientWidth/100;
	let adjustedLeft = event.clientX-0.35*pixelWidth;

	let adjustedTop = event.clientY;
	//TODO: if(leftMouseDown) move whole image up a little to match cursor y
	if(leftMouseDown)
	{

	}
	let widthPercent = event.clientX/document.body.clientWidth;
	let handRotate = widthPercent * 40 - 20;
	// let adjustedTop = event.clientY-0.02*document.body.clientHeight;
	cursorImage.style.left = adjustedLeft+'px';
	cursorImage.style.top = adjustedTop+'px';
	// cursorImage.style.transform = "rotate("+handRotate+"deg)";
}

document.onmousemove = function(event)
{
	//get x and y, update cursor location
	event.preventDefault(); //stop draggable images
	mouseX = event.clientX;
	mouseY = event.clientY;
	if(isDraggingVolume)
	{
		let distanceMoved = volumeDragStart - mouseY;
		moveVolumeKnob(distanceMoved);
	}
	else
	{
		if(!isTouchScreen)
		{
			updateCursorImage(event); //keeps image with cursor
		}
	}
};



function smallSpin(id, degrees)
{
	document.getElementById(id).style.transform = "rotate("+degrees+"deg)";
	setTimeout(function()
	{
		document.getElementById(id).style.transform = "rotate(0deg)";
	}, 100);
}

function shakeY(id, shakeAmount)
{
	document.getElementById(id).style.transform = "translateY("+shakeAmount+"%)";
	setTimeout(function()
	{
		document.getElementById(id).style.transform = "translateY(0%)";
	}, 100);
}

function showSnare()
{
	snare.style.opacity = "1";
	helpText.style.top = "14vw";
	helpText.style.left = "58vw";
	helpText.style.transform = "rotate(15deg)";
	helpText.innerHTML = "Now This!";
}

function showKick()
{
	kick.style.opacity = "1";
	helpText.style.opacity = "0";
}

function loadImages()
{
	imageList = document.getElementsByTagName("img");

	let allSrc = animationImages;

	for(var i=0; i<imageList.length; i++)
	{
		allSrc.push(imageList[i].src);
		imageList[i].draggable = false;
	}

	for(var i=0; i<allSrc.length; i++)
	{
		var currentSrc =allSrc[i];
		var toPreload = new Image();
		toPreload.src = currentSrc;
		preLoaded.push(toPreload);
	}
}

//Plays audio based on sound string
function playSoundLocal(soundName, duration)
{
	var audioID = soundName+"Audio";
	let audioElement = document.getElementById(audioID);
	audioElement.volume = getVolumeFromSoundName(soundName);
	audioElement.currentTime = 0;
	audioElement.play();
	if(duration != null)
	{
		setTimeout(function()
		{
			stopSoundLocal(soundName);
			unAnimate(soundName);
		}, duration);
	}
}

function stopSound(soundName)
{
	// console.log(soundName+' stopped.');
	if(!allDrums.includes(soundName))
	{
		if(testingLocal)
		{
			stopSoundLocal(soundName);
		}
		else
		{
			stopSoundApi(soundName, 0);
		}
		//untap animations
		unAnimate(soundName);
	}
}

//just piano for now
function unAnimate(soundName)
{
	if(soundName.charAt(0) == 'p')
	{
		resetPianoKey(soundName);
	}
}

function saveNoteToTrack(soundName)
{
	if(stage == STUDIO && getIsRecording()) //&& recording?
	{
		//add note with duration
		//add duration to recording note
		//LOOPER playsound api with stopsoundapi(duration as delay)
		setNoteDuration(soundName);
	}
}

function stopSoundLocal(soundName, delay)
{
	//need if g, get string, and mute all from that string
	// if(soundName.charAt(0) == "g")
	// {
	// 	allAudioTags = document.getElementsByTagName('audio');
	// 	for(let i = 0; i < allAudioTags.length; i++)
	// 	{
	// 		if(allAudioTags[i].id.charAt(1) == soundName.charAt(1))
	// 		{
	// 			var audioID = soundName+"Audio";
	// 			document.getElementById(audioID).pause();
	// 		}
	// 	}
	// }
	// else{
	setTimeout(function()
	{
		var audioID = soundName+"Audio";
		document.getElementById(audioID).pause();
	}, delay);

	// }

}

let showGuitar = false;
function toggleGuitar()
{
	showGuitar = !showGuitar;
	if(showGuitar)
	{
		guitarDiv.style.display = "block";
		guitarDiv.style.opacity = "1";
		cursorImage.style.width = "10vw";
	}
	else
	{
		guitarDiv.style.opacity = "0.0";
		setTimeout(function()
		{
			guitarDiv.style.display = "none";
		}, 200);
		cursorImage.style.width = "5vw";
	}
}

function mutePlayingStrings()
{
	for(let i = 0; i < playingStrings.length; i++)
	{
		let stringNumber = playingStrings[i];
		let stopDelay = i*50;
		let soundName = getSoundFromStringId(stringNumber);

		stopSound(soundName);//cant call this cos saves to loop
		saveNoteToTrack(soundName);
		// if(testingLocal)
		// {
		// 	// setTimeout(function()
		// 	// {
		// 		//stop any sounds from this string
		// 		stopSoundLocal(soundName);
		// 	// }, stopDelay);//stops quickly played notes on same string
		// }
		// else
		// {
		// 	//need sound name for stopApi, how stop any matching string?
		// 	stopSoundApi(soundName, 0);
		// 	// stopSoundApi(stringNumber, stopDelay);
		// }
	}
	playingStrings = [];
}

//need to change only if higher than previous
function fretKeyDown(fretNumber, shape)
{
	//change image to down, change position to match bar
	let newFret = (fretNumber != barPosition);
	// let newShape = (JSON.stringify(shape) !== JSON.stringify(barShape));
	let newShape = !arraysMatch(shape, barShape);

	if(newFret || newShape || !fretHandDown)
	{
		barShape = shape;
		fretHandDown = true;
		barPosition = fretNumber;
		updateFretHand();
		mutePlayingStrings();
		fretKeysHeld++;
	}
}

function arraysMatch(arr1, arr2)
{
	// Check if all items exist and are in the same order
	let match = true;
	for (var i = 0; i < arr1.length ; i++)
	{
		if(arr1[i] != arr2[i])
		{
			match = false;
		}
	}
	return match;
}

function fretKeyUp()
{
	//stop sound, change image to up
	fretKeysHeld--;
	if(fretKeysHeld < 1)
	{
		fretKeysHeld = 0;
		fretHandDown = false;
		mutePlayingStrings();
		fretHand.src = "images/fretUp.png";
		fretHand.style.width = "17%";
	}
	// console.log(fretKeysHeld);
}

//differentiate between touch and click
function addDrumListeners()
{

}

function updateFretHand()
{
	fretHand.style.width = "13%";
	if(barShape == eShape || barShape == emShape)
	{
		fretHand.src = "images/fretE.png";
		// fretHand.style.left = "21.25%";
	}
	else if(barShape == aShape)
	{
		fretHand.src = "images/fretA.png";
		// fretHand.style.left = "25.75%";
	}
	// else if(barShape == emShape)
	// {
	// 	fretHand.src = "fretE.png";
	// }
	let handLeft = barPosition*2.33 + 21.25+"%";
	fretHand.style.left = handLeft;
}

function guitarClicked(event)
{
	if(event.which == 1)
	{
		strum(-1, 20);
	}
	else if(event.which == 3)
	{
		strum(1, 20);
	}
}

function toggleStudio()
{
	if(stage == STUDIO)
	{
		stage = INTRO;
		initStageOne();
		// toggleGuitar();
	}
	else if(stage == INTRO)
	{
		stage = STUDIO;
		initStudio();
		document.getElementById("studioTrain").style.display = "none";
		// toggleGuitar();
	}
}
//take letter and position, create html visual of key (cuboid with letter)
// function drawKeyboardLetter(ctx, x, y, size, letter, isPressed)
// {
//
// 	var height = 0.8*size;
// 	if(isPressed)
// 	{
// 		y = y+0.3*height;
// 	}
// 	else
// 	{
//
// 		ctx.fillStyle = 'black';
// 		ctx.fillRect(x, y+height, size, 0.3*height);
// 	}
// 	ctx.fillStyle = '#303030';
// 	ctx.fillRect(x, y, size, height);
// 	// ctx.fillRect(x, y+height, size, 0.3*height);
// 	//need to store height outside for animation
//
// 	//get font code from mouseGame
// 	//add a couple letters to draw method
// 	ctx.fillStyle = 'white';
// 	var fontSize = 0.6*size;
// 	ctx.font = fontSize+'px Righteous';
// 	/* ctx.fillStyle='black'; */
// 	ctx.fillText(letter, x+(0.5*fontSize), y+height-(0.25*size));
// }

//takes hotkey letter and tappable image, calculates the percentage position
//    values based on left/topPos (percentage of image width/height)
function createHotkey(letter, instrumentId, leftPos, topPos)
{
	//get computed style left, width/top, height, convert to percent
	//    via parent.width
	let instrument = document.getElementById(instrumentId);
	let parent = instrument.parentNode;
	let style = getComputedStyle(instrument);

	let left = style.left;
  left = parseFloat(left.slice(0, -2));
	let width = style.width;
  width = parseFloat(width.slice(0, -2));

	let parentWidth = parent.getBoundingClientRect().width;

	let instLeftPercent = Math.ceil(left/parentWidth*100);
	let instWidthPercent = Math.ceil(width/parentWidth*100);
	let hotKeyLeftPercent = instLeftPercent+leftPos*instWidthPercent;

	let instTop = style.top;
	instTop = parseFloat(instTop.slice(0, -2));
	let instHeight = style.height;//not set
	// let instHeight = instrument.getBoundingClientRect().height;//not set
	instHeight = parseFloat(instHeight.slice(0, -2));
	let test = instrument.getBoundingClientRect();
	// console.log(instHeight);

	let parentHeight = parent.getBoundingClientRect().height;

	let instTopPercent = Math.ceil(instTop/parentHeight*100);
	let instHeightPercent = Math.ceil(instHeight/parentHeight*100);
	let hotKeyTopPercent = instTopPercent+topPos*instHeightPercent;
	//rect.left+0.42*rect.width;
	// document.getElementById("q").style.left = hotKeyLeftPercent+"%";
	var rect = document.getElementById(instrumentId).getBoundingClientRect();

	let letterEl = document.createElement('p');
	letterEl.classList.add('hotkeyLetter');
	if(!showHotkeys)
	{
		letterEl.classList.add('hidden');
	}
	letterEl.innerHTML = letter;
	letterEl.style.left = hotKeyLeftPercent+"%";
	letterEl.style.top = hotKeyTopPercent+"%";
	parent.appendChild(letterEl);
	allHotkeys.push(letterEl);
	return letterEl;
		// console.log(instLeftPercent, instWidthPercent);
}

//for x2 x3 multipliers
//could just move instead of create each time
function writeAt(char, x, y)
{
	multipleGuide.style.left = x;
	multipleGuide.style.top = y;
	multipleGuide.innerHTML = char;
}

// let topFretHotkeys = ['a', 's', 'd'];
// let bottomFretHotkeys = ['z', 'x', 'c'];
function createGuitarHotkeys()
{
	//3 top 3 bottom, 3 right (strings)
	let allLabels = [];
	for(let i = 0; i < 9; i++)
	{
		let letterEl = document.createElement('p');
		letterEl.style.top = "15%";
		letterEl.classList.add('hotkeyLetter');
		letterEl.classList.add('hidden');
		letterEl.innerHTML = guitarHotkeys[i];
		allLabels.push(letterEl);
		guitarDiv.appendChild(letterEl);
		allHotkeys.push(letterEl);
	}
	allLabels[0].style.left = "25%";
	allLabels[1].style.left = "35%";
	allLabels[2].style.left = "45%";

	allLabels[3].style.left = "25%";
	allLabels[3].style.top = "55%";
	allLabels[4].style.left = "35%";
	allLabels[4].style.top = "55%";
	allLabels[5].style.left = "45%";
	allLabels[5].style.top = "55%";

	allLabels[6].style.right = "0%";
	allLabels[6].style.top = "17%";
	allLabels[7].style.right = "0%";
	allLabels[7].style.top = "35%";
	allLabels[8].style.right = "0%";
	allLabels[8].style.top = "53%";
	// setTimeout(function()
	// {
	// 	guitarDiv.style.display = 'none';
	// },100)
}

function createDrumHotkeys()
{
	let xPercent = 0.42;
	let yPercent = 0.55;
	createHotkey(drumHotkeys[0], 'kick', xPercent, yPercent);
	createHotkey(drumHotkeys[1], 'hat',xPercent, yPercent);
	createHotkey(drumHotkeys[2], 'snare', xPercent, yPercent);
	// createHotkey('Q', 'kick', xPercent, yPercent);
	// createHotkey('W', 'hat',xPercent, yPercent);
	// createHotkey('E', 'snare', xPercent, yPercent);
}

function createKeyboardHotkeys()
{
	let xPercent = 0.15;
	// createHotkey("5", blackKeys[1].id, xPercent, yPercent);
	// createHotkey("6", blackKeys[3].id, xPercent, yPercent);
	// createHotkey("8", blackKeys[5].id, xPercent, yPercent);
	// createHotkey("9", blackKeys[7].id, xPercent, yPercent);
	// createHotkey("0", blackKeys[9].id, xPercent, yPercent);
	let hotKeyHackArray = blackHotkeys.filter(a => a !== -1);
	// for(let i = 0; i < blackKeyNum; i++)
	for(let i = 0; i < blackKeys.length; i++)
	{
		let keyId = blackKeys[i][1].id;
		// createHotkey(whiteKeyHotkeys[i].toUpperCase(), keyId, xPercent, 0.55);
		let hotkey = hotKeyHackArray[i];
		// if(hotkey == null || hotkey == -1)
		if(hotkey == null)
		{
			hotkey = '';
			// i++;
		}
		createHotkey(hotkey, keyId, xPercent, 0.55);
	}

	for(let i = 0; i < whiteKeyNum; i++)
	{
		let keyId = "p"+(i+1);
		// createHotkey(whiteKeyHotkeys[i].toUpperCase(), keyId, xPercent, 0.55);
		let hotkey = pianoHotkeys[i];
		if(hotkey == null) hotkey = '';
		createHotkey(hotkey, keyId, xPercent, 0.65);
	}
}

function toggleHotkeys()
{
	showHotkeys = !showHotkeys;
	// allHotkeys = document.getElementsByClasName();
	for(let i = 0; i < allHotkeys.length; i++)
	{
		let el = allHotkeys[i];
		if(!showHotkeys)
		{
			el.classList.add('hidden');
		}
		else
		{
			el.classList.remove('hidden');
		}
	}
	// showHotkeys = !showHotkeys;
	// //seperate for each instrument, add/remove class hidden
	// // keyboardHotkeys[] etc
	// for(let i = 0; i < drumHotkeys.length(); i++)
	// {
	// 	if(showHotkeys)
	// 	{
	// 		el.classList.add('hidden');
	// 	}
	// 	else
	// 	{
	// 		el.classList.remove('hidden');
	// 	}
	//
	// }
}


function clearLoopTimers()
{
	for(let i = 0; i < loopTimers.length; i++)
	{
		clearInterval(loopTimers[i]);
	}
	// clearInterval(loopTimer);
}


document.ontouchstart = function(evt)
{

}

document.onmousedown = function(evt)
{
	leftMouseDown = true;
	// cursorImage.src = "images/cursorDown.png";

	if(evt.preventDefault) evt.preventDefault();

	if(!isDraggingVolume)
	{
		cursorImage.src = "images/cursorDown.png";
	}
}

document.onmouseup = function(evt)
{
	leftMouseDown = false;
	cursorImage.src = "images/cursor.png";
	cursorImage.style.transform = 'rotate(0deg)';

	if(isDraggingVolume)
	{
		isDraggingVolume = false;
		volumeInstrument = '';
		volumeDragStart = null;
	}
}


//should be element tpgether in array
// let pianoHotkeys = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220, 103, 104, 105];//q to 9num
// let blackHotkeys = [50, 51, -1, 53, 54, 55, -1, 57, 48, -1, 187, 8];

let pianoHotkeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'n7', 'n8'];//q to 9num
let blackHotkeys = ['2', '3', -1, '5', '6', '7', -1,  '9', '0', -1, '=', 'Backspace'];
// let stringHotkeys = ['n4', 'n5', 'n6'];
// let topFretHotkeys = ['a', 's', 'd'];
// let bottomFretHotkeys = ['z', 'x', 'c'];
// let drumHotkeys = ['a', 's', 'd'];

// let blackHotkeys = [50, 51, 53, 54, 55, 57, 48, 187];
// let pianoHotkeys = [90, 88, 67, 86, 66, 78, 77, 188, 190, 191];//z to /
function hotkeyTap(evt)
{
	let soundName = keyCodeToSoundname(evt);
	//check if a valid soundname
	if(soundName != 'none')
	{
		tap(soundName);
	}
}

//on key up
//need check for drums to not stop sound if(!allDrums.contains())
function checkStopSound(evt)
{
	let soundName = keyCodeToSoundname(evt);
	if(soundName != 'none')//check for p/pb
	{
		stopSound(soundName);
		saveNoteToTrack(soundName);
		//only if p, need others for
		// resetPianoKey(soundName);
	}
}

function resetPianoKey(soundName)
{
	let from;
	let element = document.getElementById(soundName);
	if(soundName.charAt(0) == 'p')
	{
		if(soundName.charAt(1) == 'b')//white keys
		{
			from = 35;
			if(highlightKeys) element.src = "images/blackKey.png";
			element.style.top = from+'%';
		}
		else
		{
			from = 40;
			if(highlightKeys) element.src = "images/whiteKey.png";
			element.style.top = from+'%';
		}
	}
}

//need to only work for current active sounds (e.g. 3 white keys shouldnt allow > E)
function keyCodeToSoundname(evt)
{
	let soundName = 'none';
	let key = evt.key;
	let keyIsNumber = !isNaN(parseInt(evt.key));
	if(keyIsNumber)
	{
		//differentiate between keypad numbers
		if(evt.location == 3)//keypad
		{
			key = 'n'+key;
		}
	}

	if(pianoHotkeys.includes(key))
	{
		let soundIndex = pianoHotkeys.indexOf(key);
		// tap('p'+(soundIndex+1));
		soundName = 'p'+(soundIndex+1);
	}
	else if(blackHotkeys.includes(key))
	{
		let soundIndex = blackHotkeys.indexOf(key);
		// let octave = Math.floor(soundIndex/5);
		// let partialOctave = (soundIndex+1)%5;
		// let offset = octave;
		// if(partialOctave > 2)
		// {
		// 	offset += 1;
		// }
		// tap('pb'+(soundIndex+1+offset));
		soundName = 'pb'+(soundIndex+1);
		// soundName = 'pb'+(soundIndex+1+offset);
	}
	else if(drumHotkeys.includes(key))
	{
		let soundIndex = drumHotkeys.indexOf(key);
		switch(soundIndex)
		{
			case 0:
				soundName = 'kick';
				break;
			case 1:
				soundName = 'hat';
				break;
			case 2:
				soundName = 'snare';
				break;
			// case 0:
			// 	soundName = 'kick';
			// 	break;
		}
	}
	// else if(guitarHotkeys.includes(keyCode))
	// {
	// 	let soundIndex = pianoHotkeys.indexOf(keyCode);
	// 	tap('g'+soundIndex);//different, have sorted by string? leftHandHotKeys/rightHand
	// 	// fretKeyDown(7, emShape);
	// 	// 	stringTap(4, true);
	// }

	return soundName;
}

let lastKey = -1;
let recordedKeyCodes = [];
let recordString = '';
document.onkeydown = function(evt) {

	//should be if any current/active hotkey array contains event.key
	if(lastKey != evt.keyCode)	hotkeyTap(event);
	lastKey = event.keyCode;

	recordedKeyCodes.push(event.key);
	// recordString = recordString.concat((event.keyCode+', '));
		switch(event.keyCode){

		// case 49: //1
		// // allTracks[1].clear();
		// // allTracks[1].togglePlaying();
		// setStage(STUDIO);
		// 	break;
		// case 50: //2
		// // allTracks[2].togglePlaying();
		// setStage(QUICK);
		// 	break;
		// case 51: //3
		// // allTracks[3].togglePlaying();
		// setStage(INTRO);
		// 	break;
		// case 52: //4
		// // toggleMetronome();
		// 	break;


		case 65: //A

			break;
		case 83: //S

			break;
		case 68: //D
			fretKeyDown(3, aShape);
			// fretKeyDown(5, aShape);
			break;
		case 90: //Z
			fretKeyDown(1, eShape);
			// fretKeyDown(3, eShape);
			break;
		case 88: //X
			fretKeyDown(3, eShape);
			// fretKeyDown(5, eShape);
			break;
		case 67: //C
			fretKeyDown(5, emShape);
			// fretKeyDown(7, emShape);
			break;

			case 97: //PAD1
				// stringTap(2, true);
				setStage(STUDIO);
				break;
			case 98: //PAD2
				// stringTap(3, true);
				setStage(QUICK);
				break;
			case 99: //PAD3
				// stringTap(4, true);
				setStage(INTRO);
				break;
			case 102: //PAD6
				stringTap(5, true);
				break;
			case 101: //PAD5
				stringTap(4, true);
				break;
			case 100: //PAD4
				stringTap(3, true);
				break;
			case 37: //LEFT
				stringTap(2, true);
				break;

			//piano
		// case 82: //R
		// 	tap('p1');
		// 	break;
		// case 84: //T
		// 	tap('p2');
		// 	break;
		// case 89: //Y
		// 	tap('p3');
		// 	break;
		// case 85: //u
		// 	tap('p4');
		// 	break;
		// case 73: //i
		// 	tap('p5');
		// 	break;
		// case 79: //o
		// 	tap('p6');
		// 	break;
		// case 80: //p
		// 	tap('p7');
		// 	break;


		// case 53: //5
		// 	tap('pb1');
		// 	break;
		// case 54: //6
		// 	tap('pb2');
		// 	break;
		// case 56: //8
		// 	tap('pb4');
		// 	break;
		// case 57: //9
		// 	tap('pb5');
		// 	break;
		// case 48: //0
		// 	tap('pb6');
		// 	break;

		case 76: //L
			// playNextPhase();
			// drumTrackS1.queueAllNotes(0);
			// loopTrack(drumTrackS1, 0);
			// playLastLoop();
			// toggleStudio();
			// createDrumHotkeys();
			// createKeyboardHotkeys();
			// toggleHotkeys();
				// let phaseSize = 7;//will be dynamic phaseLengths[phasePos]
				//
				//  // add phaseLengths[0 - phasePos]
				// let phaseStart = phasePos*phaseSize;//will be add all previous notes
				// twinkleTrack.queueSomeNotes(phaseStart, phaseStart+phaseSize, 0);
				// phasePos++;
				// break;
		case 77: //M
			// playNextPhase();
			// loopPhase(8);
			// pianoTrackS1.queueAllNotes(0);
			// setTempo(parseInt(document.getElementById("tempoInput").value));
// 				clearInterval(loopTimers[0]);
// 				loopTimers.shift();
// 				createCloseRandomPhase(9);
// 				loopRandomTrack();
			// createCloseRandomPhase(13);
			break;
		case 78: //N
			// clearInterval(loopTimer);
			// toggleStudio();
			// createOneRandomPhase(5);



			// console.log(record.join("', '"));
			console.log(recordedKeyCodes.join("', '"));
			helpText.innerHTML = recordedKeyCodes.join(", ");
			// record = [];
			break;
		case 66: //B
			// barPosition = 3;
			toggleGuitar();
				// strum(1);
			break;
		case 32: //SPACE
		toggleOggRecording();
			// playLoopBuffer();
			// restartRiffs();
			break;
		case 38: //UP
			// strum(-1, 10);
			transpose(1);
			break;
		case 40: //DOWN
			// strum(1, 10);
			transpose(-1);
			// strum(-1, 10);
			break;
		case 13:
			setTempo(parseInt(document.getElementById("tempoInput").value));
		}
}

document.onkeyup = function(evt)
{
	// checkStopSound(evt.keyCode);
	checkStopSound(evt);
	lastKey = -1;
		switch(evt.keyCode)
		{
			case 90: //Z
				//hand image to up, stop sound
				fretKeyUp();
				break;
			case 88: //
				fretKeyUp();
				break;
			case 68: //D
				shape = eShape;
				fretKeyUp();
				break;
			case 67: //C
				shape = eShape;
				fretKeyUp();
				break;

			case 102: //PAD6
				document.querySelector('#stringRing').src = 'images/stringRing.png';
				break;
			case 101: //PAD5
				document.querySelector('#stringMiddle').src = 'images/stringMiddle.png';
				break;
			case 100: //PAD4
				document.querySelector('#stringIndex').src = 'images/stringIndex.png';
				break;
			case 37: //LEFT
				document.querySelector('#stringThumb').src = 'images/stringThumb.png';
				break;
		}

}

//rebuild keyboard?
window.onresize = function(evt)
{
	windowWidth = window.innerWidth;
}
