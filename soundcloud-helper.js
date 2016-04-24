'use strict';

const SC = require('request');

let SoundCloudHelper = {

  search(query){
    let queryResponse;

    SC.get('https://api.soundcloud.com/tracks?q=' +
           query + "&client_id=e6cec03e9db1f86a994857320fa6b7e3",
           function(error, response, body){
      if ( error ) {
        console.log(err);
      } else {
        queryResponse = body;
      }
    });
    console.log(queryResponse)
  }
}

module.exports = SoundCloudHelper;
