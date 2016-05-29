'use strict';

const SoundCloudHelper = require('./soundcloud-helper');
const SongMatcher = require('./song-matcher');

let songMatcher, response;

let Router = {

  songSearch(message, socket){
    SoundCloudHelper.search(message, socket);
  },

  playSong(message, store, io){
    store.initTemp(message.id);
    io.sockets.emit('newPlay', message);
  },

  identifySong(store, socket){
    songMatcher = new SongMatcher();
    store.getSongs();
    socket.emit('startIdProcess');
  },

  logPlay(store, message){
    store.updateTemp(message);
  },

  logIdentify(message, store, socket){
    songMatcher.logFFT(message);
    response = songMatcher.assessMatch(store);

    if(response !== null){ SoundCloudHelper.findTrackNameByID(response['id'], socket) };
  }
  
}

module.exports = Router;
