'use strict';

const SC = require('request');

let SoundCloudHelper = {

  search(query, socket){

    SC.get('https://api.soundcloud.com/tracks?q=' +
           query + "&client_id=e6cec03e9db1f86a994857320fa6b7e3",
           function(error, response, body){
      if ( error ) {
        console.log(err);
      } else {
        socket.emit('searchResult', body)
      }
    });
  },

  findTrackNameByID(songID, socket){
    let id = Number(songID)

    console.log(id)

    SC.get('http://api.soundcloud.com/tracks/' + id + '?client_id=e6cec03e9db1f86a994857320fa6b7e3',
           function(error, response, body){
      if ( error ) {
        console.log(err);
      } else {
        socket.emit('match', body)
      }
    });
  }
}

module.exports = SoundCloudHelper;
