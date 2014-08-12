module.exports = handle

function handle(duplexPort, handler){
  duplexPort.on('data', handler)
  return function remove(){
    duplexPort.removeListener('data', handler)
  }
}