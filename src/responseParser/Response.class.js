module.exports = class Response {
  constructor() {
    this.statusCode = ''
    this.httpVersion = ''
    this.statusText = ''
    this.headers = Object.create(null)
  }
  setStatusCode(statusCode) {
    this.statusCode = statusCode
  }
  setHttpVersion(httpVersion) {
    this.httpVersion = httpVersion
  }
  setStatusText(statusText) {
    this.statusText = statusText
  }
  setBody(body) {
    this.body = body
  }
  addHeader(name, value) {
    this.headers[name] = value
  }
  getStatusCode() {
    return this.statusCode
  }
  getStatusText() {
    return this.statusText
  }
  getHeader(name) {
    return this.headers[name]
  }
  getBody() {
    return this.body
  }
}