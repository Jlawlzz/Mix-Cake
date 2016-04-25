'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let searchBar = document.getElementById('search-bar');
let searchButton = document.getElementById('search-button');
let identifyDiv = document.getElementById('identify');
let identifyButton = document.getElementById('identify-button');
let identifyBar = document.getElementById('identify-bar');
let seeStoreButton = document.getElementById('see-store-button');
let searchResults = document.getElementById('search-results');
let recentlyPlayed = document.getElementById('recently-played');
let context = new webkitAudioContext()

let array = null;
let botFreq = 0
let botHighFreq = 0
let midFreq = 0
let midHighFreq = 0
let highFreq = 0

let song, songChild, button, state, id,
    audio, source, analyser, url,
    bufferLength, dataArray, botPeak,
    botHighPeak, midPeak, midHighPeak,
    highPeak, title

searchButton.addEventListener('click', function(){
  let searchVal = searchBar.value;
  socket.send('songSearch', searchVal);
});

seeStoreButton.addEventListener('click', function(){
  socket.send('seeStore');
});

identifyButton.addEventListener('click', function(){
  socket.send('identifySong')
});

socket.on('startIdProcess', function() {
  state = 'logIdentify'
  FFTAnalyze.resetPeaks();
  FFTAnalyze.cleanArray();
  AudioControl.playSong(identifyBar.value)
})

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Current Listeners: ' + count;
});

socket.on('newPlay', function (message) {
  setHTML.appendRecentlyPlayed(message)
});

socket.on('searchResult', function(response){
  JSON.parse(response).forEach(function(songParams){
    setHTML.appendSearchResults(songParams)
  });
});

socket.on('match', function(response){
  title = JSON.parse(response).title
  identifyDiv.innerHTML = '<h2>' + title + '</h2>'
});

let setHTML = {

  appendSearchResults(songParams){
    songChild = document.createElement('div');
    songChild.innerHTML = HTMLStore.getSearchSongEl(songParams);
    searchResults.appendChild(songChild);
    button = document.getElementById('button' + songParams.id);
    button.addEventListener('click', function(){
      FFTAnalyze.resetPeaks();
      FFTAnalyze.cleanArray();
      socket.send('storeSong')
      socket.send('playSong', songParams);
      AudioControl.playSong(songParams.id);
      state = 'logPlay'
    });
  },

  appendRecentlyPlayed(songParams){
    songChild = document.createElement('div');
    songChild.innerHTML = HTMLStore.getRecentSongEl(songParams);
    recentlyPlayed.appendChild(songChild);
    button = document.getElementById('buttonRecent' + songParams.id);
    button.addEventListener('click', function(){
      FFTAnalyze.resetPeaks();
      FFTAnalyze.cleanArray();
      AudioControl.playSong(songParams.id);
      state = 'logPlay'
    });
  }

}

let HTMLStore = {

  getSearchSongEl(songParams){
    return '<h5>' + songParams.title + '</h5>' + '<button id="button' + songParams.id + '">play</button>' + '</br>'
  },

  getRecentSongEl(songParams){
    return '<h5>' + songParams.title + '</h5>' + '<button id="buttonRecent' + songParams.id + '">play</button>' + '</br>'
  },

}

let AudioControl = {

  playSong(id){
    this.setContext(id)
    this.setNodeChain(id)
    this.setBuffer()
    this.setInterval()
  },

  setContext(trackID){
    id = trackID
    if (context != null) {
      context.close()
      context = new webkitAudioContext()
    }
  },

  setNodeChain(trackID){
    audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3';
    audio.crossOrigin = "anonymous";
    audio.src = url;
    source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    source.mediaElement.play();
  },

  setBuffer(){
    analyser.fftSize = 4096;
    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);
    FFTAnalyze.resetPeaks()
  },

  setInterval(){
    let metroMeasure = setInterval(FFTAnalyze.takeMeasurement, 1);
    let metroRecordMeasure = setInterval(FFTAnalyze.recordMeasurement, 20);
  },

  wipeInterval(){
    clearInterval(metroMeasure)
    clearInterval(metroRecordMeasure)
  }

}

let FFTAnalyze = {

  recordMeasurement(){
    if (array !== null){ socket.send(state, {'id': id, 'fft': array});}
    FFTAnalyze.resetPeaks()
  },

  resetPeaks(){
    botPeak = 0
    botHighPeak = 0
    midPeak = 0
    midHighPeak = 0
    highPeak = 0
  },

  cleanArray(){
    array = null
  },

  takeMeasurement(){
    analyser.getByteFrequencyData(dataArray);

    botFreq = dataArray[6];
    botHighFreq = dataArray[12];
    midFreq = dataArray[50];
    midHighFreq = dataArray[300];
    highFreq = dataArray[500];

    botPeak = FFTAnalyze.setFingerPrint(botPeak, botFreq)
    botHighPeak = FFTAnalyze.setFingerPrint(botHighPeak, botHighFreq)
    midPeak = FFTAnalyze.setFingerPrint(midPeak, midFreq)
    midHighPeak = FFTAnalyze.setFingerPrint(midHighPeak, midHighFreq)
    highPeak = FFTAnalyze.setFingerPrint(highPeak, highFreq)
    
    if(array !== null){ FFTAnalyze.setFFTArray() }
  },

  setFingerPrint(peak, freq){
    if ((peak < freq) && (freq != null)){
      if (array === null){ array = 0 };
      return freq
    } else {
      return peak
    }
  },

  setFFTArray(){
    array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
    console.log(array)
  }

}
