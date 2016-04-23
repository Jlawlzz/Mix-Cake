var context, source, audio
context = new webkitAudioContext()
function setup(){
}

var playSong = function(trackID){
  console.log(trackID)
  if (context != null) {
    context.close()
    context = new webkitAudioContext()
  }
  audio = new Audio(), source, url = 'http://api.soundcloud.com/tracks/' + trackID + '/stream' + '?client_id=e6cec03e9db1f86a994857320fa6b7e3'
  audio.crossOrigin = "anonymous"
  audio.src = url
  source = context.createMediaElementSource(audio)
  source.connect(context.destination)
  source.mediaElement.play()
}

var audio, source, analyser, context, dataArray, bufferLength, fft;

function setup(){
  context = new webkitAudioContext()

  SC.initialize({
    client_id: 'e6cec03e9db1f86a994857320fa6b7e3'
  });

  analyser.fftSize = 4096;
  bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  dataArray = new Uint8Array(bufferLength);

  botPeak = 0;
  botHighPeak = 0;
  midPeak = 0;
  midHighPeak = 0;
  highPeak = 0;
}

$('#search_id').on('click', function(){
  $('#search_text').text('')
})

jQuery.expr[':'].Contains = function(a, i, m) {
return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
jQuery.expr[':'].contains = function(a, i, m) {
return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};


function trackList(tracks){
  $("#search_results").append("<ul id='track-list-view'></ul>");
  var li = "<li>";
  trackArray = [];
  tracks.forEach(function(track){
    var button = ["<button type='button' style='width:1000px;color:orange;' id=" + track.id + ">" + track.title + ' ' + "</button>", track.title]
    li = "<li>"
    $("#track-list-view").append(li.concat(button[0] + '</li>'))
    trackArray.push(track.id)
  });
}

for(var i=0; i< trackArray.length; i++) {
   (function(index) {
        imageArray[index].addEventListener("click", function() {
           console.log("you clicked region number " + index);
         })
   })(i);
}


setEventListener = function(trackID) {
  $("#" + trackID).addEventListener("click", playSong);
}

$('#search').on('keyup',function(){
  var val = this.value;
  SC.get('/tracks', {
    q: val, license: 'cc-by'
  }).then(function(tracks) {
    console.log(tracks)
    $("#search_results").html('')
    trackList(tracks)
  });
})


$('#search').on('keyenter',function(){
   $('#search_text').text('feed me');
 })

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

var urlStream = 0

var myTime = setInterval(myTimer, 20);
var array = []
var payloadArray = []

var timer = 0

function myTimer(){

  timer++

  if (timer >= 50) {
    console.log(payloadArray)
    // $.ajax({
    //         type: 'POST',
    //         url: '/fingerprints',
    //         data: { frequencies: payloadArray }
    //     });
    payloadArray = []
    timer = 0
  }

  payloadArray.push(array)

  botPeak = 0;
  botHighPeak = 0;
  midPeak = 0;
  midHighPeak = 0;
  highPeak = 0;
}

// function myAjax() {
//   console.log(payloadArray)
//   $.ajax({
//           type: 'POST',
//           url: '/songs',
//           data: { frequencies: payloadArray }
//       });
//
//   payloadArray = []
// }

function draw(){
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  var botFreq = dataArray[6];
  var botHighFreq = dataArray[12];
  var midFreq = dataArray[50];
  var midHighFreq = dataArray[300];
  var highFreq = dataArray[500];

  if ((botPeak < botFreq) && (botFreq != null)){
      botPeak = botFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((botHighPeak < botHighFreq) && (botHighFreq != null)){
      botHighPeak = botHighFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((midPeak < midFreq) && (midFreq != null)){
      midPeak = midFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((midHighPeak < midHighFreq)  && (midHighFreq != null)){
      midHighPeak = midHighFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  if ((highPeak < highFreq) && (highFreq != null)){
      highPeak = highFreq;

      array = [botPeak, botHighPeak, midPeak, midHighPeak, highPeak]
  }

  endShape();
}
