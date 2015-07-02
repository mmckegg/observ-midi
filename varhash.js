var ObservVarhash = require('observ-varhash')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiVarhash

function midiVarhash(duplexPort, output){

  var obs = ObservVarhash()
  obs.output = output || ObservVarhash()

  var outputValues = {}

  var removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues, clearInput)
  ]

  obs.destroy = function() {
    removeListeners.forEach(invoke)
  }

  if (output){
    updateOutput(output())
  }

  return obs

  /// scoped

  function handleData(data){
    var key = data[0] + '/' + data[1]
    obs.put(key, data[2])
  }

  function updateOutput(values){
    Object.keys(values).forEach(function(key){
      var value = getValue(values[key])
      if (outputValues[key] !== value){
        outputValues[key] = value
        duplexPort.write(getMessage(key, value))
      }
    })
  }

  function clearInput(){
    Object.keys(obs()).forEach(function(key){
      obs.put(key, null)
    })
  }

}