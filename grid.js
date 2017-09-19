var Observ = require('observ')
var ArrayGrid = require('array-grid')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')
var write = require('./lib/write.js')
var getMappedMessage = require('./lib/get-mapped-message')

module.exports = midiGrid

function midiGrid(duplexPort, mapping, output){


  var obs = Observ(ArrayGrid([], mapping.shape, mapping.stride))
  obs.output = output || Observ(ArrayGrid([], mapping.shape, mapping.stride))

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
    var coords = mapping.lookup(msg.key)
    if (coords) {
      var newArray = ArrayGrid(obs().data.slice(), mapping.shape, mapping.stride)
      newArray.set(coords[0], coords[1], msg.value)
      obs.set(newArray)
    }
  }

  function updateOutput(grid){
    var length = grid.shape[0] * grid.shape[1]
    for (var i=0;i<length;i++){
      var key = mapping.data[i]
      var lastValue = outputValues[key] || 0
      var value = getValue(grid.data[i])
      if (key != null && lastValue !== value){
        outputValues[key] = value
        write(duplexPort, getMessage(key, value))
      }
    }
  }

  function clearInput(){
    obs.set(ArrayGrid([], mapping.shape, mapping.stride))
  }

}
