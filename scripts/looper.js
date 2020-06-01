
//need measures
class Track
{
  constructor(number, notes, isSelected, title)
  {
    this.number = number;
    this.isPlaying = true;
    this.isSelected = isSelected;//for recording?
    this.isRecording = false;
    this.notes = [];
    this.phaseLengths = [];
    if(title != null)
    {
      this.title = title;
    }

    if(notes != null)
    {
      // will just be this.notes = notes, no need for this method
      this.addNoteList(notes);
    }
  }


  addNote(soundName, beatsFromStart, duration)
  {
    // this.notes.push(new Note(soundName, timeFromStart, duration));
    this.notes.push(new Note(soundName, beatsFromStart, duration));
  }
  //will be list of Note i.e. beats
  addNoteList(noteList)
  {
    for(let i = 0; i < noteList.length; i++)
    {
      // let timeFromStart = i * beatTime;//notes need times ['p1', 1.5]
      this.addNote(noteList[i], i);
    }
  }

  clear()
  {
    this.notes = [];
  }

  togglePlaying()
  {
    this.isPlaying = !this.isPlaying;
  }

  queueAllNotes(queueDelay)
  {
    for(let i = 0; i < this.notes.length; i++)
    {
      let note = this.notes[i];
      let delayInMs = note.beatsFromStart*loopBeatTime;
      let delay = delayInMs+queueDelay;
      let duration = note.duration;
      let soundName = note.soundName;
      // pianoKeyPressed(soundName, delay);
      animateAndPlaySound(soundName, delay, duration, -1);//note needs to store string/isguitar

      // stopSoundApi(soundName, duration);
      if(testingLocal)
      {
        setTimeout(function()
        {
          resetPianoKey(soundName);
        }, delay+duration)
        stopSoundLocal(soundName, delay+duration);
      }
      else //playsound handles duration, not needed
      {
        setTimeout(function()
        {
          resetPianoKey(soundName);
        }, delay+duration)
        stopSoundApi(soundName, delay+duration);
      }
    }
  }

  queueSomeNotes(from, to, queueDelay)
  {
    let delayMinus = this.notes[from].beatsFromStart*loopBeatTime;
    for(let i = from; i < to; i++)
    {
      let note = this.notes[i];
      let delayInMs = note.beatsFromStart*loopBeatTime-delayMinus;
      //needs to minus all previous times i.e. first note = 0
      let delay = delayInMs+queueDelay;
      let soundName = note.soundName;
      let duration = note.duration;
      // pianoKeyPressed(soundName, delay);
      animateAndPlaySound(soundName, delay, duration, -1);//note needs to store string/isguitar
      if(testingLocal)
      {
        setTimeout(function()
        {
          resetPianoKey(soundName);
        }, delay+duration)
        stopSoundLocal(soundName, delay+duration);
      }
    }
  }

  getLastNoteTime()
  {
    let longestNoteDelay = 0;
    for(let i = 0; i < this.notes.length; i++)
    {
      let note = this.notes[i];
      if(note.beatsFromStart*loopBeatTime > longestNoteDelay)
      {
        longestNoteDelay = note.beatsFromStart*loopBeatTime;
      }
    }
    return longestNoteDelay;
  }
}

class Note
{
  constructor(soundName, beatsFromStart, duration)
  {
    this.soundName = soundName;
    // this.timeFromStart = timeFromStart;
    this.beatsFromStart = beatsFromStart;
    this.duration = duration;
    if(duration == null) this.duration = 200;
  }
}

let isRecording = false;
let recordedTap = 0;
let tempoTapCount = 0;
let tempoStartTime;
let loopBeatTime = 300;//need to set this at stage init, based on tempo
// let timesBetween;
let allTracks;
let startTime;
let trackRecording;
let playMetronome = true;
let quantizeTo;
// let showingIntro = true;
let tempo;

let metronomeTimer, trackLoopTimer;

let toAdd = {};

initStudioLooper();
function initStudioLooper()
{
  allTracks = [];
  for(let i = 1; i < 4; i++)//3 tracks
  {
    let newTrack = new Track(i);
    allTracks[i] = newTrack;
  }
  // timesBetween = [];
}

function getIsRecording()
{
  return isRecording;
}

function setBeatTime(timeMs)
{
  loopBeatTime = timeMs;
}

function getAllTracks()
{
  return allTracks;
}

//could just check what to toggle based on target id
function togglePressed(toToggle, event)
{
  if(toToggle == "metronome")
  {
    toggleMetronome();
  }
  else if(toToggle == "hotkeys")
  {
    toggleHotkeys();
  }

  let element = event.target;
  if(element.classList.contains("toggleDisabled"))
  {
    event.target.classList.remove("toggleDisabled");
    event.target.classList.add("toggleEnabled");
  }
  else if(element.classList.contains("toggleEnabled"))
  {
    event.target.classList.remove("toggleEnabled");
    event.target.classList.add("toggleDisabled");
  }
}

function toggleMetronome()
{
  playMetronome = !playMetronome;
}

// function toggleHotkeys()
// {
//
// }
// let currentlyHeldNotes = [];
// = ['soundName', startTime, notes index?]
//for recording
function recordTap(soundName)
{
  let tapTime;
  tapTime = new Date().getTime();
  if(isRecording)//should be if any track.isrecording
	{
    recordedTap++;
    //could loop for all recording tracks if enable multi track recording;
    // i.e. if(track.isRecording) track.addnote
    let track = allTracks[trackRecording];
    let timeSinceStart = tapTime - startTime;
    if(recordedTap == 1 && isLoopTutorial)//first recorded tap //need and if intro
    {
      //timeout 4xbeat to show next message
      setTimeout(function()
      {
        helpText.innerHTML = "Press to save loop";
      }, loopBeatTime*4);
    }
    // startTime = tapTime;
    let quantizedTime = roundToNearestQuant(timeSinceStart);
    // console.log(quantizedTime, "then");
    // if(typeof quantizedTime === "undefined")
    // {
    //   quantizedTime = timeSinceStart;
    // }
    // console.log(quantizedTime);
    let beatsFromStart = quantizedTime/loopBeatTime;
    // currentlyHeldNotes.push(soundName);
    // currentlyHeldNotes.push(track.notes.length); //need index in track to edit duration
    // track.addNote(soundName, beatsFromStart);
    toAdd[soundName] = [beatsFromStart, tapTime]
	}
}

function getNoteCount()
{
  let track = allTracks[trackRecording];
  return track.notes.length;
}

function setNoteDuration(soundName)
{
  let track = allTracks[trackRecording];
  let duration = new Date().getTime() - toAdd[soundName][1]; //need to be ms?
  track.addNote(soundName, toAdd[soundName][0], duration);
}

function roundToNearestQuant(timeSinceStart)
{
  for(let checkTime = 0; checkTime < loopBeatTime*4; checkTime+=quantizeTo)
  {
    let timeDifference = timeSinceStart - checkTime;
    if(timeDifference < 0)
    {
      timeDifference *= -1;
    }

    if(timeDifference < quantizeTo/2)
    {
      // console.log(quantizeTo, timeSinceStart, checkTime/quantizeTo);
      return checkTime;
    }
  }
  //if doesn't work, just return unquantized time
  console.log("huh");
  return timeSinceStart;

}

function tempoTap()
{
  tempoTapCount++;
  animateAndPlaySound("metronome", 0);
  if(tempoTapCount == 1)
  {
    tempoStartTime = new Date().getTime();
    clearInterval(metronomeTimer);
  }
  else if(tempoTapCount == 4)
  {
    loopBeatTime = (new Date().getTime() - tempoStartTime)/3;
    quantizeTo = loopBeatTime/4;//should take as input/selectable
    tempo = Math.floor(60/(loopBeatTime/1000));
    //studio turorial
    trackRecording = 1;
    isRecording = true;
    document.getElementById("tempoInput").value = tempo;

    if(checkIfLoopTutorial())
    {
      hideLoopTutorialStart();
    }



    //TODO: set interval at half beat time to check whether to queue another
    //        metronome click
    startTime = new Date().getTime()+loopBeatTime;
    // setTimeout(startMetronomeLoop, loopBeatTime);
    setTimeout(startTrackLoop, loopBeatTime);
    // startMetronomeLoop();
    // metronomeTimer = setInterval(animateAndPlaySound, loopBeatTime, "metronome", 0);
    tempoTapCount = 0;
  }
}

function startMetronomeLoop()
{
  animateAndPlaySound("metronome", 0);
  animateAndPlaySound("metronome", loopBeatTime);
  animateAndPlaySound("metronome", 2*loopBeatTime);
  animateAndPlaySound("metronome", 3*loopBeatTime);
  metronomeTimer = setInterval(function()
  {
    if(playMetronome)
    {
      animateAndPlaySound("metronome", 0);
      animateAndPlaySound("metronome", loopBeatTime);
      animateAndPlaySound("metronome", 2*loopBeatTime);
      animateAndPlaySound("metronome", 3*loopBeatTime);
    }
  }, 4*loopBeatTime);
}

function addMetronomeNotes()
{
  animateAndPlaySound("metronome", 0);
  animateAndPlaySound("metronome", loopBeatTime);
  animateAndPlaySound("metronome", 2*loopBeatTime);
  animateAndPlaySound("metronome", 3*loopBeatTime);
}

function startTrackLoop()
{
  startTime = new Date().getTime();
  queueAllTracks();
  if(playMetronome)
  {
    addMetronomeNotes();
  }
  trackLoopTimer = setInterval(function()
  {
    startTime = new Date().getTime();
    queueAllTracks();
    if(playMetronome)
    {
      addMetronomeNotes();
    }
  }, 4*loopBeatTime);
}

function queueAllTracks()
{
  for(let i = 1; i < allTracks.length; i++)
  {
    let thisTrack = allTracks[i];
    if(thisTrack.isPlaying)
    {
      thisTrack.queueAllNotes(0);
    }
  }
}

function toggleRecord(trackNumber)
{
  let track = allTracks[trackNumber];
  isRecording = !isRecording;
  track.isRecording = !track.isRecording;
  trackRecording = trackNumber;
  if(track.isRecording)
  {
    // document.getElementById("recordButton"+trackNumber).style.backgroundColor = "red";
    document.getElementById("recordButton"+trackNumber).src = "images/trackButtonRecording.png";

  }
  else if(!track.isRecording)
  {
    document.getElementById("recordButton"+trackNumber).src = "images/trackButtonPlaying.png";
    // document.getElementById("recordButton"+trackNumber).style.backgroundColor = "black";
    // playLastLoop();
    // recordedTap = 0;
  }
}

//change track state and images
function cycleTrackButton(trackNumber) //or update track state?
{
  let track = allTracks[trackNumber];

  if(!track.isPlaying)
  {
    if(track.notes.length < 1) //no notes so start recording
    {
      playMetronome = true;
      startTrackLoop();
      toggleRecord(trackNumber);
      track.isPlaying = true;
      // console.log("empty start record");
      // startTime = new Date().getTime();
      // if(showingIntro)
      if(isLoopTutorial)
      {
        helpText.innerHTML = "And that's it!";
        isLoopTutorial = false; //hide help text?
      }
    }
    else
    {
      // startMetronomeLoop();
      // startTime = new Date().getTime();
      track.togglePlaying();
      startTrackLoop();
      // console.log("start playing");
      document.getElementById("recordButton"+trackNumber).src = "images/trackButtonPlaying.png";
    }
  }
  else if(track.isRecording)//if recording stop recording (playing)
  {
    // track.isRecording = false;
    toggleRecord(trackNumber);
    playMetronome = false;
    // console.log("stop recording");
    //if first recorded track, set
    if(isLoopTutorial)
    {
      helpText.innerHTML = "Press again </br>to pause";
    }
  }
  else if(track.isPlaying)
  {
    track.togglePlaying();
    // console.log("stop playing");
    clearInterval(trackLoopTimer);
    document.getElementById("recordButton"+trackNumber).src = "images/trackButtonPaused.png";
    if(isLoopTutorial)
    {
      helpText.innerHTML = "Press trash </br>can to delete";
    }
  }
  //if stopped !empty start playing
}

function clearTrack(trackNumber)
{
  let track = allTracks[trackNumber];
  track.clear();
  //if only last playing track
  clearInterval(trackLoopTimer);
  track.isPlaying = false;
  document.getElementById("recordButton"+trackNumber).src = "images/trackButtonEmpty.png"
  if(isLoopTutorial)
  {
    helpText.innerHTML = "Press to start</br> new loop";
  }
}

function playTrack(trackId)
{
  allTracks[trackId].queueAllNotes(0);
  // allTracks[allTracks.length-1].queueAllNotes(0);
}
function setTempo(bpm)
{
  clearInterval(trackLoopTimer);
  //need to recalculate all note timings
  //when stored could measure it based on tempo
  //    e.g. timeSinceStart/loopBeatTime
  tempo = bpm;
  // let oldBeat = Math.floor(loopBeatTime);
  loopBeatTime = Math.floor(60/tempo*1000);
  startTrackLoop();
  // document.getElementById("tempoInput").value = loopBeatTime+" old"+oldBeat;
}
