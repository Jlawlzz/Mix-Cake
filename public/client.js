'use strict';

let socket = io();

let connectionCount = document.getElementById('connection-count');
let playSongBut = document.getElementById('play-song');

playSongBut.addEventListener('click', function(){
  playSong(257571450);
  socket.send('songPlay', 'playing!');
});

socket.on('usersConnected', function (count) {
  connectionCount.innerText = 'Connected Users: ' + count;
});

let audio, analyser, source, url;
let context = new webkitAudioContext()

let playSong = function(trackID){
  audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3';
  audio.crossOrigin = "anonymous";
  audio.src = url;
  source = context.createMediaElementSource(audio);
  analyser = context.createAnalyser();
  source.connect(analyser);
  analyser.connect(context.destination);
  source.mediaElement.play();
}
