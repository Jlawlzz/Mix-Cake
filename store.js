'use strict';

let client;

if (process.env.REDISTOGO_URL) {
  let rtg   = require("url").parse(process.env.REDISTOGO_URL);
  client = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  client = require("redis").createClient();
}

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

let getFingerprints = function(solidStore){
  client.hgetall('FFTprints', function(err, reply) {
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
  client.hmset("FFTprints", JSON.stringify(`${store.currentSong}`),
                                   JSON.stringify(store.tempStore[`${store.currentSong}`]),
               function(err, reply) {
                 console.log(reply)
               })
}

module.exports = Store;
