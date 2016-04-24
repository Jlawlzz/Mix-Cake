'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let searchBar = document.getElementById('search-bar');
let searchButton = document.getElementById('search-button');
let searchResults = document.getElementById('search-results');

let song, songChild, button

searchButton.addEventListener('click', function(){
  let searchVal = searchBar.value;
  socket.send('songSearch', searchVal);
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Current Listeners: ' + count;
});

socket.on('searchResult', function(response){
    JSON.parse(response).forEach(function(songParams){
      songChild = document.createElement('div');
      songChild.innerHTML = '<h3>' + songParams.id + '</h3>' + '</br>' + '<button id="button' + songParams.id + '">play</button>'
      searchResults.appendChild(songChild);
      button = document.getElementById('button' + songParams.id);
      button.addEventListener('click', function(){
        socket.send('playSong', songParams.id);
        console.log(songParams.id);
      });
    });
});

let Song = function(options) {
  this.id = options.id;
};
