observ-midi
===

Observe and write to a midi stream as a single value, struct, array or grid.

## Install via [npm](https://npmjs.org/package/observ-midi)

```bash
$ npm install observ-midi
```

## Examples

```js
var ObservMidi = require('observ-midi')
var MidiStream = require('midi-stream')

var duplexPort = MidiStream('Launchpad Mini')
```

### A single value ([Observ](https://github.com/raynos/observ)):

```js
var button = ObservMidi(duplexPort, '144/0') // Observ
button(function(value){
  // visual feedback
  button.output.set(value)
})
```

### A range of values ([ObservArray](https://github.com/raynos/observ-array)):

```js
var range = ObservMidi(dupexPort, ['144/0', '144/1', '144/2']) // ObservArray
range(function(value){
  if (value._diff){
    // visual feedback
    range.output.splice.apply(range.output, value._diff)
  }
})
```
### ArrayGrid ([ObservGrid](https://github.com/mmckegg/observ-grid))

```js
var grid = ObservMidi(duplexPort, ArrayGrid(['144/0', '144/1'], [2,1])) // ObservGrid
grid(function(value){
  if (value._diff){
    value._diff.forEach(function(diff){
      grid.output.set(diff[0], diff[1], diff[2])
    })
  }
})
```

### Struct ([ObservStruct](https://github.com/raynos/observ-struct))

```js
var map = ObservMidi(duplexPort, { play: '176/110', stop: '176/111' }) // ObservStruct

map(function(values){
  var diff = values._diff
  Object.keys(diff).forEach(function(key){
    // visual feedback
    map[key].output.set(diff[key])
  })
})

map.play(function(value){
  // visual feedback
  map.store.output.set(value)
})
```

### Variable Hash ([ObservVarhash](https://github.com/nrw/observ-varhash))

```js
var lookup = ObservMidi(duplexPort) // ObservVarhash
lookup(function(value){
  var diff = values._diff
  Object.keys(diff).forEach(function(key){
    // visual feedback
    lookup.output.put(key, diff[key])
  })
})
```

### Resend all output on switch

```js
duplexPort.emit('switch') // clear input values, resend all current output values
```