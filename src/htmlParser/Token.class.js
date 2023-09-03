module.exports = class Token {
  constructor(type, content) {
    this.type = type
    this.content = content
    this.attributes = Object.create(null)
  }
  setType(type) {
    this.type = type
  }
  getType() {
    return this.type
  }
  setContent(content) {
    this.content = content
  }
  getContent() {
    return this.content
  }
  setAttribute(name, value) {
    this.attributes[name] = value
  }
  getAttributes() {
    return this.attributes
  }
  getLog() {
    const type = this.getType()
    const content = this.getContent()
    const attributes = this.getAttributes()
    return JSON.stringify(Object.keys(attributes).length === 0 ? {
      type,
      content
    } : {
      type,
      content,
      attributes
    })
  }
}