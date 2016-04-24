'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let searchBar = document.getElementById('search-bar');
let searchButton = document.getElementById('search-button');
let searchResults = document.getElementById('search-results');

let song

searchButton.addEventListener('click', function(){
  let searchVal = searchBar.value;
  socket.send('songSearch', searchVal);
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Current Listeners: ' + count;
});

socket.on('searchResult', function(response){
    console.log(response);
  });



let Song = function(options) {
};

Song.prototype.getHTML = function() {
};
