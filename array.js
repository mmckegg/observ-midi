var ObservArray = require('observ-array')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiArray

function midiArray(duplexPort, mapping){

  var obs = ObservArray([])
  obs.output = ObservArray([])

  var outputValues = {}

  var removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues, clearInput)
  ]

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
    values.forEach(function(value, i){
      var key = mapping[i]
      if (key != null && outputValues[key] !== value){
        outputValues[key] = value
        duplexPort.write(getMessage(key, value))
      }
    })
  }

  function clearInput(){
    obs.splice(0, obs.data.getLength())
  }

}