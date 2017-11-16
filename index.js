module.exports = ObservMidi

function ObservMidi(duplexPort, mapping, output){
  // output is optional

  if (!mapping){ // ObservVarhash
    return require('./varhash.js')(duplexPort)

  } else if (typeof mapping === 'string'){ // Observ
    return require('./value.js')(duplexPort, mapping, output)

  } else if (Array.isArray(mapping)){ // ObservArray
    return require('./array.js')(duplexPort, mapping, output)

  } else if (mapping.shape && mapping.stride && mapping.data){ // ObservGrid
    return require('./grid.js')(duplexPort, mapping, output)

  } else if (mapping instanceof Object){ // ObservStruct
    return require('./struct.js')(duplexPort, mapping, output)

  }
}
