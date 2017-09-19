var ObservStruct = require('observ-struct')
var Observ = require('observ')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')
var write = require('./lib/write.js')
var getMappedMessage = require('./lib/get-mapped-message')

module.exports = midiStruct

function midiStruct(duplexPort, mapping){

  var struct = {}
  var lookup = {}
  var outputValues = {}

  var removeListeners = [
    handle(duplexPort, handleData),
    handleResend(duplexPort, outputValues, clearInput)
  ]

  Object.keys(mapping).forEach(function(key){
    lookup[mapping[key]] = struct[key] = Observ()
    var output = struct[key].output = Observ()
    removeListeners.push(output(updateOutput.bind(this, mapping[key])))
  })

  var obs = ObservStruct(struct)

  obs.destroy = function() {
    removeListeners.forEach(invoke)
  }

  return obs

  /// scoped

  function handleData (data) {
    var msg = getMappedMessage(data)
    var target = lookup[msg.key]
    if (target) {
      target.set(msg.value)
    }
  }

  function updateOutput(key, value){
    value = getValue(value)
    if (outputValues[key] !== value){
      outputValues[key] = value
      write(duplexPort, getMessage(key, value))
    }
  }

  function clearInput(){
    Object.keys(obs()).forEach(function(key){
      obs[key].set(null)
    })
  }
}
