'use strict';

let redis = require('redis');
let client = redis.createClient();

let Store = function(){
  this.tempStore = {}
  this.solidStore = []
  this.currentSong = null
}

Store.prototype.initTemp = function(id){
  this.tempStore[`${id}`] = []
  this.currentSong = id
}

Store.prototype.updateTemp = function(message){
  if ( message['fft'] !== null ){
    this.tempStore[`${message['id']}`].push(message['fft'])
  }
}

Store.prototype.logTemp = function(id){
  if (this.currentSong !== null) {
    client.hmset("randFFT2", JSON.stringify(`${this.currentSong}`), JSON.stringify(this.tempStore[`${this.currentSong}`]),
                 function(err, reply) {
                   console.log(reply)
                 })
  }
}

Store.prototype.getSongs = function(){

  let sStore = this.solidStore

  client.hgetall('randFFT2', function(err, reply) {
    Object.keys(reply).forEach(function (key) {
      sStore.push([key, reply[key]])
    })
  })
}

client.on('connect', function() {
    console.log('connected');
});

module.exports = Store;
