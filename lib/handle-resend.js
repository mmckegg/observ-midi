var getMessage = require('./get-message.js')

module.exports = handleResend

function handleResend(port, outputValues, cb){
  port.on('switch', resend)

  function resend(){
    Object.keys(outputValues).forEach(function(key){
      port.write(getMessage(key, outputValues[key]))
    })
    if (typeof cb == 'function'){
      cb()
    }
  }

  return function remove(){
    port.removeListener('switch', resend)
  }
}