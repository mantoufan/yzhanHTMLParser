const { Readable } = require('stream') // Stream 也行
module.exports = class StringStream extends Readable {
  constructor(string) {
    super()
    // 字符串转流
    this.string = string
  }
  _read() { // 如果继承 Stream，把 _read 改成 read
    for (const char of this.string) {
      this.emit('data', char)
    }
    this.emit('end')
  }
}