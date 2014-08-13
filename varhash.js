var ObservVarhash = require('observ-varhash')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiVarhash

function midiVarhash(duplexPort, output){

  var obs = ObservVarhash()
  obs.output = output || ObservVarhash()

  var outputValues = {}

  obs._removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues, clearInput)
  ]

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
      if (outputValues[key] !== values[key]){
        outputValues[key] = values[key]
        duplexPort.write(getMessage(key, values[key]))
      }
    })
  }

  function clearInput(){
    Object.keys(obs()).forEach(function(key){
      obs.put(key, null)
    })
  }

}