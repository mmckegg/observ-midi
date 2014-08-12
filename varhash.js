var ObservVarhash = require('observ-varhash')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiVarhash

function midiVarhash(duplexPort){

  var obs = ObservVarhash()
  obs.output = ObservVarhash()

  var outputValues = {}

  obs._removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues)
  ]

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

}