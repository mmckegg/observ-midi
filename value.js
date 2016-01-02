var Observ = require('observ')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')
var getValue = require('./lib/get-value.js')
var write = require('./lib/write.js')

module.exports = midiValue

function midiValue(duplexPort, mapping, output){

  var obs = Observ()
  obs.output = output || Observ()

  var outputValues = {}

  var removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues, clearInput)
  ]

  if (output){
    updateOutput(output())
  }

  obs.destroy = function() {
    removeListeners.forEach(invoke)
  }

  return obs

  /// scoped

  function handleData(data){
    var key = data[0] + '/' + data[1]
    if (mapping == key){
      obs.set(data[2])
    }
  }

  function updateOutput(value){
    value = getValue(value)
    if (outputValues[mapping] !== value){
      outputValues[mapping] = value
      write(duplexPort, getMessage(mapping, value))
    }
  }

  function clearInput(){
    obs.set(null)
  }

}

function invoke(f) {
  f()
}
