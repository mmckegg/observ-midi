module.exports = function write (port, message) {
  var stream = typeof port === 'function' ? port() : port
  if (stream) {
    stream.write(message)
  }
}
