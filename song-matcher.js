'use strict';

const songAnalysis = require('./song-analysis');

let songs, diffs;

let SongMatcher = function(){
  this.fftArray = [];
};

SongMatcher.prototype.logFFT = function(payload){
  this.fftArray.push(payload);
};

SongMatcher.prototype.assessMatch = function(store){
  return compareFFT(this.fftArray, store.solidStore);
};

let compareFFT = function(fftArray, songs){
  if(fftArray.length == 201){
    diffs = songs.map( function(song){
      return songAnalysis(song, fftArray);
    });
    return diffs.sort(function(a, b){ return a['diff'] - b['diff'] })[0];
  } else {
    return null;
  }
};

module.exports = SongMatcher;
