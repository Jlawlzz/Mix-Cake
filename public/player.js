playSong = function(trackID){
  function(){
    audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3';
    audio.crossOrigin = "anonymous";
    audio.src = url;
    source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    source.mediaElement.play();
  }
 }

module.exports = playSong;
