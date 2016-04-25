'use strict';

const songAnalysis = require('./songAnalysis');

let songs, diffs;

let SongMatcher = function(){
  this.fftArray = []
}

SongMatcher.prototype.logFFT = function(payload){
  this.fftArray.push(payload)
}

SongMatcher.prototype.assessMatch = function(store){

  let fftArray = this.fftArray

  if(fftArray.length == 201){

    songs = store.solidStore

    diffs = songs.map( function(song){
      return songAnalysis(song, fftArray)
    });

    console.log(diffs.sort(function(a, b){ return a['diff'] - b['diff'] })[0])

    return diffs.sort(function(a, b){ return a['diff'] - b['diff'] })[0];

  } else {

    return null

  }
}

module.exports = SongMatcher;
