var ObservGrid = require('observ-grid')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiGrid

function midiGrid(duplexPort, mapping){

  var obs = ObservGrid([], mapping.shape, mapping.stride)
  obs.output = ObservGrid([], mapping.shape, mapping.stride)

  var outputValues = {}

  var removeListeners = [
    handle(duplexPort, handleData),
    obs.output(updateOutput),
    handleResend(duplexPort, outputValues)
  ]

  return obs

  /// scoped

  function handleData(data){
    var key = data[0] + '/' + data[1]
    var coords = mapping.lookup(key)
    if (coords){
      obs.set(coords[0], coords[1], data[2])
    }
  }

  function updateOutput(values){
    values.data.forEach(function(value, i){
      var key = mapping.data[i]
      if (key != null && outputValues[key] !== value){
        outputValues[key] = value
        duplexPort.write(getMessage(key, value))
      }
    })
  }

}