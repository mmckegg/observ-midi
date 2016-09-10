var getMessage = require('./get-message.js')

module.exports = handleResend

function handleResend (port, outputValues, cb) {
  var releases = []

  if (typeof port === 'function') {
    releases.push(port(resend))
    if (port.onClose) {
      releases.push(port.onClose(release))
    }
  } else {
    port.on('switch', resend)
    releases.push(function remove () {
      port.removeListener('switch', resend)
    })
  }

  return release

  // scoped

  function release () {
    while (releases.length) {
      releases.pop()()
    }
  }

  function resend () {
    var stream = typeof port === 'function' ? port() : port
    if (stream) {
      Object.keys(outputValues).forEach(function (key) {
        stream.write(getMessage(key, outputValues[key]))
      })
      if (typeof cb === 'function') cb()
    }
  }
}
