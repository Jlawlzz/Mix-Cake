'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let measurementDisplay = document.getElementById('measurements');
let playSongRef = document.getElementById('play-song-one');
let playSongUnk = document.getElementById('play-song-two');
let playSongQuest = document.getElementById('play-song-question');
let pause = document.getElementById('pause');
let play = document.getElementById('play');
let compare = document.getElementById('compare')
let requestMeasurementOne = document.getElementById('request-measurement-one');
let requestMeasurementTwo = document.getElementById('request-measurement-two');

let id_1 = 257571450
let id_2 = 257926235
let id
let state

playSongRef.addEventListener('click', function(){
  id = id_1
  playSong(id_1);
  state = 'measurementRef'
  socket.send('songPlay', id_1);
});

playSongUnk.addEventListener('click', function(){
  id = id_2
  playSong(id_2);
  state = 'measurementRef'
  socket.send('songPlay', id_2);
});

playSongQuest.addEventListener('click', function(){
  id = id_1
  playSong(id_1);
  state = 'measurementUnk'
  socket.send('songGuess', id_1);
});

compare.addEventListener('click', function(){
  socket.send('findDiff', id_1);
});

pause.addEventListener('click', function(){
  context.suspend();
});

play.addEventListener('click', function(){
  context.resume();
});

requestMeasurementOne.addEventListener('click', function(){
  socket.send('songReport', id_1);
});

requestMeasurementTwo.addEventListener('click', function(){
  socket.send('songReport', id_2);
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('songReport', function (measurements) {
  measurementDisplay.innerText = measurements
  console.log(measurements);
});

socket.on('difference', function (diff) {
  console.log(diff);
});

let audio, analyser, source, url;
let context = new webkitAudioContext()

let playSong = function(trackID){
  audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3';
  audio.crossOrigin = "anonymous";
  audio.src = url;
  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  source.connect(analyser);
  analyser.connect(context.destination);
  setupStream();
  source.mediaElement.play();
  let metroMeasure = setInterval(takeMeasurement, 1);
  let metroRecordMeasure = setInterval(recordMeasurement, 20);
}

let botPeak, botHighPeak, midPeak, midHighPeak, highPeak, dataArray, bufferLength;

let setupStream = function(){
  analyser.fftSize = 4096;
  bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);

  botPeak = 0;
  botHighPeak = 0;
  midPeak = 0;
  midHighPeak = 0;
  highPeak = 0;
}

let array;
let botFreq = 0
let botHighFreq = 0
let midFreq = 0
let midHighFreq = 0
let highFreq = 0

let takeMeasurement = function(){
  analyser.getByteFrequencyData(dataArray);

  botFreq = dataArray[6];
  botHighFreq = dataArray[12];
  midFreq = dataArray[50];
  midHighFreq = dataArray[300];
  highFreq = dataArray[500];

  if ((botPeak < botFreq) && (botFreq != null)){
      botPeak = botFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((botHighPeak < botHighFreq) && (botHighFreq != null)){
      botHighPeak = botHighFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((midPeak < midFreq) && (midFreq != null)){
      midPeak = midFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((midHighPeak < midHighFreq)  && (midHighFreq != null)){
      midHighPeak = midHighFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((highPeak < highFreq) && (highFreq != null)){
      highPeak = highFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }
}

let recordMeasurement = function(){
  socket.send(state, [id, array]);
  botPeak = 0
  botHighPeak = 0
  midPeak = 0
  midHighPeak = 0
  highPeak = 0
}
