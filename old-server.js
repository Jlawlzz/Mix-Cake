'use strict';

const http = require('http');
const express = require('express');
const analyze = require('./songAnalysis');
const app = express();
const loDash = require('lodash');

app.use(express.static('public'));

let server = http.createServer(app);
let tick
let tick2

const socketIo = require('socket.io');
const io = socketIo(server);

let port = process.env.PORT || 3000;

let simpleStore = {}
let tempStore = []

server.listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

io.on('connection', function (socket) {
  console.log('A user has connected.');

  io.sockets.emit('usersConnected', io.engine.clientsCount);

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });

  socket.on('message', function (channel, message) {

    if(channel === 'songPlay'){

      tick = 0
      console.log(`Playing song #${message}`);

      simpleStore[`${message}`] = []

    } else if (channel === 'songGuess'){
      tick2 = 0
      console.log(`Playing song #${message}`);

    } else if (channel === 'measurementRef'){

      if(message[1] !== null){
        tick += 1
        simpleStore[`${message[0]}`].push({ 'time': tick, 'measurement': message[1], 'id': message[0]});
      }

    } else if (channel === 'measurementUnk'){

      if(message[1] !== null){
        tick2 += 1
        tempStore.push({ 'time': tick2, 'measurement': message[1]});
      }

    } else if (channel === 'findDiff'){

      let songRefs = loDash.values(simpleStore)

      let song = songRefs.filter(function(songRef){
        let min = loDash.min(analyze(songRef, tempStore))
        return (min < 1) && (min > -1)
      });

      console.log(song)

      io.sockets.emit('match', song);

    } else {
      io.sockets.emit('songReport', simpleStore[`${message}`])
    }
  });
});

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = server;
