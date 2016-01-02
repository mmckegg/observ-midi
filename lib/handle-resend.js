var getMessage = require('./get-message.js')

module.exports = handleResend

function handleResend (port, outputValues, cb) {
  if (typeof port === 'function') {
    return port(resend)
  } else {
    port.on('switch', resend)
    return function remove () {
      port.removeListener('switch', resend)
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
