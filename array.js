var ObservArray = require('observ-array')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')

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

  function handleData(data){
    var key = data[0] + '/' + data[1]
    var index = mapping.indexOf(key)
    if (~index){
      obs.put(index, data[2])
    }
  }

  function updateOutput(values){
    for (var i=0;i<values.length;i++){
      var key = mapping[i]
      var value = getValue(values[i])
      if (key != null && outputValues[key] !== value){
        outputValues[key] = value
        duplexPort.write(getMessage(key, value))
      }
    }
  }

  function clearInput(){
    obs.splice(0, obs.getLength())
  }

}