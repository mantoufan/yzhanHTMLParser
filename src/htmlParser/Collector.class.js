const { Writable } = require('stream')
// Self-DIY stream
module.exports = class Collector extends Writable  {
  constructor() {
    super()
    this.data = []
  }

  write(chunk) {
    this.data.push(chunk)
  }
}