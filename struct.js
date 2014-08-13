var ObservStruct = require('observ-struct')
var Observ = require('observ')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')

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


  return obs

  /// scoped

  function handleData(data){
    var key = data[0] + '/' + data[1]
    var target = lookup[key]
    if (target){
      target.set(data[2])
    }
  }

  function updateOutput(key, value){
    value = getValue(value)
    if (outputValues[key] !== value){
      outputValues[key] = value
      duplexPort.write(getMessage(key, value))
    }
  }

  function clearInput(){
    Object.keys(obs()).forEach(function(key){
      obs[key].set(null)
    })
  }
}