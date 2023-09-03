const { EventEmitter } = require("node:events")
const Response = require("./Response.class.js")
const ChunkedBodyParser = require("../chunkedBodyParser/ChunkedBodyParser.class.js")
const HtmlParser = require("../htmlParser/HtmlParser.class.js")
const EOF = Symbol('EOF')

// 封装
module.exports = class ResponseParser extends EventEmitter {
  constructor() {
    super()
    let name = '', value = ''
    this.response = new Response()
    this.state = start
    function start (char) {
      if (char === ' ') return afterHttpVersion
      this.response.httpVersion += char
      return start
    }
    
    function afterHttpVersion(char) {
      if (char === ' ') return afterStatusCode
      this.response.statusCode += char
      return afterHttpVersion
    }
    
    function afterStatusCode(char) {
      if (char === '\n') return afterStatusText
      if (char !== '\r') this.response.statusText += char
      return afterStatusCode
    }
    
    function afterStatusText(char) {
      if (char === ' ') return afterHeaderName
      if (char === '\n') return afterHeader
      if (char !== ':') name += char
      return afterStatusText
    }
    
    function afterHeaderName(char) {
      if (char === '\n') {
        this.response.headers[name] = value
        value = name = ''
        return afterStatusText
      }
      if (char !== '\r') value += char
      return afterHeaderName
    }
    
    function afterHeader(char) {
      if (char === '\n') {
        // if (this.response.headers['Transfer-Encoding'] === 'chunked') {
        //   this.bodyParser = new ChunkedBodyParser()
        //   this.bodyParser.pipe(process.stdout)
        // }
        if (this.response.headers['Content-Type'] === 'text/html') {
          this.bodyParser = new HtmlParser()
          this.bodyParser.pipe(process.stdout)
        }
        return afterEmptyLine
      }
      return afterHeader
    }
    
    function afterEmptyLine(char) {
      if (char === EOF) return success
      this.bodyParser.write(char)
      return afterEmptyLine
    }
    
    function success() {
      return success
    }
  }
  write(chunk) {
    for (const char of chunk.toString()) {
      this.state = this.state(char)
    }
    this.state = this.state(EOF)
    return this.response
  }
  end() {
    console.log(this.response)
    // console.log('end')
  }
  receiveChar(char) {
    this.state = this.state(char)
  }
}
