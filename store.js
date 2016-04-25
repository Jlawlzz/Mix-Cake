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
  saveTempStore(message, this)
}

Store.prototype.logTemp = function(id){
  if (this.currentSong !== null) {
    saveIntoMem(this);
  }
}

Store.prototype.getSongs = function(){
  getFingerprints(this.solidStore);
}

client.on('connect', function() {
    console.log('connected');
});

let getFingerprints = function(solidStore){
  client.hgetall('FFTfingerprints3', function(err, reply) {
    Object.keys(reply).forEach(function (key) {
      solidStore.push([key, reply[key]])
    })
  })
}

let saveTempStore = function(message, store){

  if (tempStoreInRange(message, store)){
      store.tempStore[`${message['id']}`].push(message['fft'])

  } else if (tempStoreAtRange(message, store)) {
    console.log('bang')
    store.logTemp()
    store.tempStore[`${message['id']}`].push(message['fft'])

  }
}

let tempStoreInRange = function(message, store){
  return ((store.tempStore[`${message['id']}`].length < 201) && (message['fft'] !== null))
}

let tempStoreAtRange = function(message, store){
  return (store.tempStore[`${message['id']}`].length === 201)
}

let saveIntoMem = function(store){
  client.hmset("FFTfingerprints3", JSON.stringify(`${store.currentSong}`),
                                   JSON.stringify(store.tempStore[`${store.currentSong}`]),
               function(err, reply) {
                 console.log(reply)
               })
}

module.exports = Store;
