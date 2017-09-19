var ObservArray = require('observ-array')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')
var write = require('./lib/write.js')
var getMappedMessage = require('./lib/get-mapped-message')

module.exports = midiArray

function midiArray(duplexPort, mapping, output){

  var obs = ObservArray([])
  obs.output = output || ObservArray([])

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

  function handleData (data) {
    var msg = getMappedMessage(data)
    var index = mapping.indexOf(msg.key)
    if (~index) {
      obs.put(index, msg.value)
    }
  }

  function updateOutput(values){
    for (var i=0;i<values.length;i++){
      var key = mapping[i]
      var value = getValue(values[i])
      if (key != null && outputValues[key] !== value){
        outputValues[key] = value
        write(duplexPort, getMessage(key, value))
      }
    }
  }

  function clearInput(){
    obs.splice(0, obs.getLength())
  }

}
