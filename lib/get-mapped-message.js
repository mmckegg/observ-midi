module.exports = function (data) {
  if (data) {
    if (data.length === 3) {
      return {
        key: data[0] + '/' + data[1],
        value: data[2]
      }
    } else if (data.length === 2) {
      // handle condition where some devices only output two midi values
      return {
        key: String(data[0]),
        value: data[1]
      }
    }
  } else {
    // weird, how did this happen?
    return {invalid: true}
  }
}
