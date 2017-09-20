module.exports = function (data) {
  if (data && data.length) {
    var keys = []
    var value = null

    if (typeof data[0] !== 'undefined') {
      keys.push(data[0])
      value = data[1]
    }
    if (typeof data[1] !== 'undefined') {
      if (typeof data[2] !== 'undefined') {
        keys.push(data[1])
        value = data[2]
      } else {
        value = data[1]
      }
    }
    return {
      key: keys.join('/'),
      value: value
    }
  } else {
    // weird, how did this happen?
    return {invalid: true}
  }
}
