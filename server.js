'use strict';

const http = require('http');
const express = require('express');

const app = express();
const loDash = require('lodash');

const SoundCloudHelper = require('./soundcloud-helper');
const SongMatcher = require('./song-matcher');

const Store = require('./store')

app.use(express.static('public'));

let server = http.createServer(app);

const socketIo = require('socket.io');
const io = socketIo(server);

let port = process.env.PORT || 3000;

let store, songMatcher, response;

server.listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

io.on('connection', function (socket) {
  console.log('A user has connected.');
  store = new Store

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });

  socket.on('message', function(channel, message) {
    if (channel === 'songSearch'){
      SoundCloudHelper.search(message, socket);

    } else if(channel === 'playSong'){
      store.initTemp(message.id);
      io.sockets.emit('newPlay', message);

    } else if(channel === 'identifySong'){
      songMatcher = new SongMatcher()
      store.getSongs()
      socket.emit('startIdProcess');

    } else if (channel === 'logPlay'){
      store.updateTemp(message);

    } else if (channel === 'logIdentify'){
      songMatcher.logFFT(message);
      response = songMatcher.assessMatch(store);

      if(response !== null){ SoundCloudHelper.findTrackNameByID(response['id'], socket) }

    } else if (channel === 'storeSong'){
      store.logTemp()

    } else if (channel === 'seeStore'){
      store.getSongs()
    }
  });
});

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = server;
