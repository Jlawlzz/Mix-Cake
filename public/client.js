'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Current Listeners:' + count;
});
