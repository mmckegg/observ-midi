module.exports = ObservMidi

function ObservMidi(duplexPort, mapping){

  if (!mapping){ // ObservVarhash
    return require('./varhash.js')(duplexPort)

  } else if (typeof mapping === 'string'){ // Observ
    return require('./value.js')(duplexPort, mapping)

  } else if (Array.isArray(mapping)){ // ObservArray
    return require('./array.js')(duplexPort, mapping)

  } else if (mapping.shape && mapping.stride && mapping.data){ // ObservGrid
    return require('./grid.js')(duplexPort, mapping)

  } else if (mapping instanceof Object){ // ObservStruct
    return require('./struct.js')(duplexPort, mapping)

  }
}