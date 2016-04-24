'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let searchBar = document.getElementById('search-bar');
let searchButton = document.getElementById('search-button');
let searchResults = document.getElementById('search-results');
let recentlyPlayed = document.getElementById('recently-played');

let song, songChild, button, state, id

searchButton.addEventListener('click', function(){
  let searchVal = searchBar.value;
  socket.send('songSearch', searchVal);
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Current Listeners: ' + count;
});

socket.on('newPlay', function (message) {
  appendRecentlyPlayed(message);
});

socket.on('searchResult', function(response){
    JSON.parse(response).forEach(function(songParams){
      appendSearchResult(songParams);
    });
});

function appendSearchResult(songParams){
  songChild = document.createElement('div');
  songChild.innerHTML = '<h5>' + songParams.title + '</h5>' + '<button id="button' + songParams.id + '">play</button>' + '</br>'
  searchResults.appendChild(songChild);
  button = document.getElementById('button' + songParams.id);
  button.addEventListener('click', function(){
    socket.send('storeSong')
    socket.send('playSong', songParams);
    playSong(songParams.id);
    state = 'log'
  });
}

function appendRecentlyPlayed(songParams){
  songChild = document.createElement('div');
  songChild.innerHTML = '<h5>' + songParams.title + '</h5>' + '<button id="buttonRecent' + songParams.id + '">play</button>' + '</br>'
  recentlyPlayed.appendChild(songChild);
  button = document.getElementById('buttonRecent' + songParams.id);
  button.addEventListener('click', function(){
    playSong(songParams.id);
    state = 'log'
  });
}

let audio, source, analyser, url, bufferLength, dataArray, botPeak, botHighPeak, midPeak, midHighPeak, highPeak;
let context = new webkitAudioContext()

let playSong = function(trackID){
  if (context != null) {
    context.close()
    context = new webkitAudioContext()
  }
  id = trackID
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
  socket.send(state, {'id': id, 'fft': array});
  botPeak = 0
  botHighPeak = 0
  midPeak = 0
  midHighPeak = 0
  highPeak = 0
}
