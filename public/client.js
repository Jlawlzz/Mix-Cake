'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let playSongBut = document.getElementById('play-song');
let id = 257571450

playSongBut.addEventListener('click', function(){
  playSong(id);
  socket.send('songPlay', id);
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
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
  let metroRecordMeasure = setInterval(recordMeasurement, 50);
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
  console.log(array)
}

let recordMeasurement = function(){
  socket.send('measurement', [id, array]);
  // array = [];
  botPeak = 0
  botHighPeak = 0
  midPeak = 0
  midHighPeak = 0
  highPeak = 0
}
