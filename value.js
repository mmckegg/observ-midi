var Observ = require('observ')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiValue

function midiValue(duplexPort, mapping){

  var obs = Observ()
  obs.output = Observ()

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
    if (mapping == key){
      obs.set(data[2])
    }
  }

  function updateOutput(value){
    if (outputValues[mapping] !== value){
      outputValues[mapping] = value
      duplexPort.write(getMessage(mapping, value))
    }
  }

}