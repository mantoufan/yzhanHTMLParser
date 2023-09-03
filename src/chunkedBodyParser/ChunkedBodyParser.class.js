const { Stream } = require("node:stream")

module.exports = class ChunkedBodyParser extends Stream {
  constructor() {
    super()
    const BASE = 16
    let chunkLength =  0
    const charMap = {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      'A': 10,
      'B': 11,
      'C': 12,
      'D': 13,
      'E': 14,
      'F': 15
    }

    const readLength = char => {
      if (char === '\r') return waitN
      // Base 16 0-9 A-F 
      chunkLength *= BASE
      chunkLength += charMap[char]
      return readLength
    }
    const waitN = char => {
      if (char === '\n') return readContent
      return waitN
    }
    const readContent = char => {
      if (chunkLength === 0) {
        return waitSecondN
      } else if (chunkLength > 0) {
        chunkLength--
        this.emit('data', char)
        return readContent
      } else {
        return readLength
      }
    }
    const waitSecondN = char => {
      if (char === '\n') return readLength
      return waitSecondN
    }
    this.state = readLength
    this.initialState = readLength
  }
  write(char) { 
    this.state = this.initialState
    // console.log(JSON.stringify(chunk))
    for (let c of this.charToChunk(char)) {
      this.receiveChar(c)
    }
  }
  end() {
    console.log('end')
  }
  receiveChar(char) {
    this.state = this.state(char)
    // console.log(this.state.name)
  }
  charToChunk(char) {
    return char.length.toString(16) + '\r\n' + char + '\r\n'
  }
}
