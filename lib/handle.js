var watch = require('observ/watch')

module.exports = handle

function handle (duplexPort, handler) {
  if (typeof duplexPort === 'function') { // if port is observable
    var lastStream = null
    var release = watch(duplexPort, function (stream) {
      if (lastStream) {
        lastStream.removeListener('data', handler)
      }

      if (stream) {
        stream.on('data', handler)
      }

      lastStream = stream
    })

    return function remove () {
      release()
      if (lastStream) {
        lastStream.removeListener('data', handler)
      }
    }
  } else { // if port is stream
    duplexPort.on('data', handler)
    return function remove () {
      duplexPort.removeListener('data', handler)
    }
  }
}
