var Observ = require('observ')
var ObservMidi = require('./')
var ObservArray = require('observ-array')

module.exports = function(duplexPort, mappings){
  var result = ObservMidi(duplexPort, mappings)
  Object.keys(mappings).forEach(extend, result)
  return result
}

function extend(key){
  var buttons = this
  var button = buttons[key]
  button.state = Observ()
  button.flash = flash
  button.light = light
  extendValueStack(button.output, [button.state])
}

function extendValueStack(obs, stack){
  if (!obs.stack){
    obs.stack = ObservArray(stack || [Observ(obs())])
    return obs.stack(function(values){
      var topValue = null
      values.forEach(function(value){
        if (value){
          topValue = value
        }
      })
      obs.set(topValue)
    })
  }
}

function light(color, insertAt){
  var output = this.output
  var obs = Observ(color)
  if (insertAt != null){
    output.stack.splice(insertAt, 0, obs)
  } else {
    output.stack.push(obs)
  }
  return function remove(){
    var index = output.stack.indexOf(obs)
    output.stack.splice(index, 1)
  }
}

function flash(color, duration){
  setTimeout(this.light(color), duration || 50)
}