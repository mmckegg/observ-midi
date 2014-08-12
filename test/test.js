var Through = require('through')
var test = require('tape')
var ObservMidi = require('../')
var ArrayGrid = require('array-grid')

test('value', function(t){

  var output = []
  var duplexPort = Through(function(data){
    output.push(data)
  })

  var obs = ObservMidi(duplexPort, '144/0')
  var changes = []
  obs(function(value){
    changes.push(value)
  })

  duplexPort.queue([144, 0, 100])
  duplexPort.queue([144, 0, 70])
  duplexPort.queue([144, 0, 0])

  obs.output.set(127)
  obs.output.set(50)
  obs.output.set(50)
  obs.output.set(0)

  t.same(output, [
    [144, 0, 127],
    [144, 0, 50],
    [144, 0, 0]
  ])

  t.same(changes, [
    100, 70, 0
  ])

  t.end()

})

test('varhash', function(t){

  var output = []
  var duplexPort = Through(function(data){
    output.push(data)
  })

  var obs = ObservMidi(duplexPort)
  var changes = []
  obs(function(value){
    changes.push(value)
  })

  duplexPort.queue([144, 0, 100])
  duplexPort.queue([144, 1, 70])
  duplexPort.queue([144, 2, 40])

  obs.output.put('144/0', 127)
  obs.output.put('144/1', 100)

  t.same(output, [
    [144, 0, 127],
    [144, 1, 100]
  ])

  t.same(changes, [
    {'144/0': 100},
    {'144/0': 100, '144/1': 70},
    {'144/0': 100, '144/1': 70, '144/2': 40}
  ])

  t.end()

})

test('struct', function(t){

  var output = []
  var duplexPort = Through(function(data){
    output.push(data)
  })

  var obs = ObservMidi(duplexPort, {
    'a': '144/0',
    'b': '144/1',
    'c': '144/2'
  })
  var changes = []
  obs(function(value){
    changes.push(value)
  })

  duplexPort.queue([144, 0, 100])
  duplexPort.queue([144, 1, 70])
  duplexPort.queue([144, 2, 40])

  obs.a.output.set(127)
  obs.b.output.set(100)
  obs.c.output.set(90)

  t.same(output, [
    [144, 0, 127],
    [144, 1, 100],
    [144, 2, 90]
  ])

  t.same(changes, [
    {'a': 100, 'b': null, 'c': null},
    {'a': 100, 'b': 70, 'c': null},
    {'a': 100, 'b': 70, 'c': 40}
  ])

  t.end()

})

test('array', function(t){

  var output = []
  var duplexPort = Through(function(data){
    output.push(data)
  })

  var obs = ObservMidi(duplexPort, ['144/0', '144/1', '144/2'])
  var changes = []
  obs(function(value){
    changes.push(value)
  })

  duplexPort.queue([144, 0, 100])
  duplexPort.queue([144, 1, 70])
  duplexPort.queue([144, 2, 40])

  obs.output.put(0, 127)
  obs.output.put(1, 100)
  obs.output.put(2, 90)

  t.same(output, [
    [144, 0, 127],
    [144, 1, 100],
    [144, 2, 90]
  ])

  t.same(changes, [
    [100],
    [100, 70],
    [100, 70, 40]
  ])

  t.end()

})

test('grid', function(t){

  var output = []
  var duplexPort = Through(function(data){
    output.push(data)
  })

  var mapping = ArrayGrid(['144/0', '144/1', '144/2', '144/3'], [2,2])
  var obs = ObservMidi(duplexPort, mapping)
  var changes = []
  obs(function(value){
    changes.push(value)
  })

  duplexPort.queue([144, 0, 100])
  duplexPort.queue([144, 1, 70])
  duplexPort.queue([144, 2, 40])
  duplexPort.queue([144, 3, 30])

  obs.output.set(0,0, 127)
  obs.output.set(0,1, 100)
  obs.output.set(1,0, 90)
  obs.output.set(1,1, 20)

  t.same(output, [
    [144, 0, 127],
    [144, 1, 100],
    [144, 2, 90],
    [144, 3, 20]
  ])

  t.equal(changes.length, 4)

  t.equal(obs.get(0,0), 100)
  t.equal(obs.get(0,1), 70)
  t.equal(obs.get(1,0), 40)
  t.equal(obs.get(1,1), 30)

  // SWITCH

  changes = []
  output = []
  duplexPort.emit('switch')

  t.equal(changes.length, 1)
  t.same(changes[0]._diff, [ 
    [ 0, 0, null ], [ 0, 1, null ], [ 1, 0, null ], [ 1, 1, null ] 
  ])
  t.equal(obs.get(0,0), null)
  t.equal(obs.get(0,1), null)
  t.equal(obs.get(1,0), null)
  t.equal(obs.get(1,1), null)

  t.same(output, [
    [144, 0, 127],
    [144, 1, 100],
    [144, 2, 90],
    [144, 3, 20]
  ])

  t.end()

})