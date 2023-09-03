const { Writable } = require('stream')
const Token = require('./Token.class')
module.exports = class HtmlParser extends Writable {
  constructor() {
    super()
    let currentToken = null
    let currentAttribueName = ''
    let currentAttribueValue = ''
    let currentTagName = ''

    const emit = token => {
      this.emit('data', token.getLog())
    }

    const isWhiteSpace = char => {
      return char === ' ' || char === '\t' || char === '\n'
    }

    const dataState = char => {
      // if (char === '&') return dataState
      if (char === '<') {
        currentToken = new Token()
        currentToken.setType('openTag')
        return tagOpen 
      }
      emit(new Token('char', char))
      return dataState
    }

    const tagOpen = char => {
      currentTagName = ''
      if (char === ' ') return tagOpen
      if (char === '/') return tagEnd
      return tagName(char) // reconsume
    }

    const tagName = char => {
      if (isWhiteSpace(char)) return beforeAttribute
      if (char === '/') return selfClosingStartTag
      if (char === '>') {
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      currentTagName += char
      return tagName 
    }

    const beforeAttribute = char => {
      if (isWhiteSpace(char)) return beforeAttribute
      if (char === '/') return selfClosingStartTag
      if (char === '>') {
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      currentAttribueName = ''
      return attributeName(char)
    }

    const attributeName = char => {
      if (isWhiteSpace(char)) return attributeName
      if (char === '/') {
        currentToken.setAttribute(currentAttribueName, currentAttribueName)
        return selfClosingStartTag
      }
      if (char === '=') return beforeAttributeValue
      currentAttribueName += char
      return attributeName
    }

    const beforeAttributeValue = char => {
      if (isWhiteSpace(char)) return beforeAttributeValue
      currentAttribueValue = ''
      if (char === '"') return attributeValueDouble
      if (char === `'`) return attributeValueSingle
      if (char === '>') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      return attributeValueUnquoted(char)
    }

    const attributeValueDouble = char => {
      if (char === '"') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return afterAttributeValueQuoted
      }
      // if (char === '&') return attributeValueDouble
      currentAttribueValue += char
      return attributeValueDouble
    }

    const attributeValueSingle = char => {
      if (char === `'`) {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return afterAttributeValueQuoted
      }
      // if (char === '&') return attributeValueSingle
      currentAttribueValue += char
      return attributeValueSingle
    }

    const attributeValueUnquoted = char => {
      if (isWhiteSpace(char)) {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return beforeAttribute
      }
      if (char === '/') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        return selfClosingStartTag
      }
      // if (char === '&') return attributeValueUnquoted
      if (char === '>') {
        currentToken.setAttribute(currentAttribueName, currentAttribueValue)
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState 
      }
      currentAttribueValue += char
      return attributeValueUnquoted
    }

    const afterAttributeValueQuoted = char => {
      if (char === '/') return selfClosingStartTag
      if (char === '>') {
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      return beforeAttribute(char)
    }

    const selfClosingStartTag = char => {
      if (char === '>') {
        currentToken.setType('selfClosingTag')
        currentToken.setContent(currentTagName)
        emit(currentToken)
        return dataState
      }
      return selfClosingStartTag
    }
    
    const tagEnd = char => {
      if (isWhiteSpace(char)) return tagEnd
      if (char === '>') {
        currentToken = new Token('closeTag')
        emit(currentToken)
        return dataState
      }
      currentToken.setType('closeTag')
      return tagName(char)
    }

    this.state = dataState
  }
  write(char) {
    this.state = this.state(char)
  }
  end() {
    this.emit('end')
  }
}