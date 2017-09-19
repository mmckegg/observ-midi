module.exports = getMessage

function getMessage(map, value){
  var message = map.split('/').map(pint)
  message.push(value)
  return message
}

function pint(i){
  return parseInt(i, 10)
}
