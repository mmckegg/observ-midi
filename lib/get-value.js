module.exports = getValue

function getValue(value){
  return ((Array.isArray(value)) ? value[value.length-1] : value) || 0
}