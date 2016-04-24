'use strict';

let redis = require('redis');
let client = redis.createClient();

let Store = function(){
  this.tempStore = {}
  this.currentSong = null
}

Store.prototype.initTemp = function(id){
  this.tempStore[`${id}`] = []
  this.currentSong = id
}

Store.prototype.updateTemp = function(message){
  if (message['fft'] !== undefined){
    this.tempStore[`${message['id']}`].push(message['fft'])
  }
}

Store.prototype.logTemp = function(id){
  if (this.currentSong !== null) {
    this.prevSong = this.currentSong
    client.set(`'${this.currentSong}'`, JSON.stringify(this.tempStore[`${this.currentSong}`]), function(err, reply) {
      console.log(reply)
    })
  }
}

Store.prototype.seeStore = function(){
  client.keys('*', function(err, reply) {
    console.log(reply)
  })
}

client.on('connect', function() {
    console.log('connected');
});

module.exports = Store;
