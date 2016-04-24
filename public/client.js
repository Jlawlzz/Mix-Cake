'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let searchBar = document.getElementById('search-bar');
let searchButton = document.getElementById('search-button');
let searchResults = document.getElementById('search-results');
let recentlyPlayed = document.getElementById('recently-played');

let song, songChild, button

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
    socket.send('playSong', songParams);
    playSong(songParams.id);
  });
}

function appendRecentlyPlayed(songParams){
  songChild = document.createElement('div');
  songChild.innerHTML = '<h5>' + songParams.title + '</h5>' + '<button id="buttonRecent' + songParams.id + '">play</button>' + '</br>'
  recentlyPlayed.appendChild(songChild);
  button = document.getElementById('buttonRecent' + songParams.id);
  button.addEventListener('click', function(){
    playSong(songParams.id);
  });
}

let audio, source, analyser, url, bufferLength, dataArray, botPeak, botHighPeak, midPeak, midHighPeak, highPeak;
let context = new webkitAudioContext()

let playSong = function(trackID){
  if (context != null) {
    context.close()
    context = new webkitAudioContext()
  }
  audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3';
  audio.crossOrigin = "anonymous";
  audio.src = url;
  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  source.connect(analyser);
  analyser.connect(context.destination);
  setupStream();
  source.mediaElement.play();
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
