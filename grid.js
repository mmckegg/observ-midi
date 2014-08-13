var ObservGrid = require('observ-grid')
var handle = require('./lib/handle.js')
var getMessage = require('./lib/get-message.js')
var getValue = require('./lib/get-value.js')
var handleResend = require('./lib/handle-resend.js')

module.exports = midiGrid

function midiGrid(duplexPort, mapping, output){

  var obs = ObservGrid([], mapping.shape, mapping.stride)
  obs.output = output || ObservGrid([], mapping.shape, mapping.stride)

  var outputValues = {}

  var removeListeners = [
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
    var coords = mapping.lookup(key)
    if (coords){
      obs.set(coords[0], coords[1], data[2])
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
        duplexPort.write(getMessage(key, value))
      }
    }
  }

  function clearInput(){
    obs.transaction(function(t){
      t.data.forEach(function(value, i){
        if (value != null){
          t.data.put(i, null)
        }
      })
    })
  }

}