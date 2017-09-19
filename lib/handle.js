var watch = require('observ/watch')

module.exports = handle

function handle (duplexPort, handler) {
  var releases = []
  if (typeof duplexPort === 'function') { // if port is observable
    var lastStream = null
    releases.push(watch(duplexPort, function (stream) {
      if (lastStream) {
        lastStream.removeListener('data', handler)
      }

      if (stream) {
        stream.on('data', handler)
      }

      lastStream = stream
    }))

    if (duplexPort.onClose) {
      releases.push(duplexPort.onClose(function () {
        while (releases.length) {
          releases.pop()()
        }
      }))
    }

    releases.push(function () {
      if (lastStream) {
        lastStream.removeListener('data', handler)
      }
    })
  } else { // if port is stream
    duplexPort.on('data', handler)
    releases.push(function remove () {
      duplexPort.removeListener('data', handler)
    })
  }

  return function relase () {
    while (releases.length) {
      releases.pop()()
    }
  }
}
