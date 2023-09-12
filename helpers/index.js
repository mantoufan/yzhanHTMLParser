const isMatched = tokens => {
  const n = tokens.length
  const stack = []
  const map = {
    'closeTag': 'openTag',
  }
  for (let i = 0; i < n; i++) {
    const token = tokens[i]
    const { type, content } = token
    if (type === 'selfClosingTag') continue
    if (type === 'openTag') {
      stack.push(token)
      // console.log(stack)
    } else if (stack[stack.length - 1].type === map[type] && stack[stack.length - 1].content === content) {
      stack.pop()
    } else {
      return false
    }
  }
  return stack.length === 0
}

const buildTree = tokens => {
  const n = tokens.length
  const stack = []
  const map = {
    'closeTag': 'openTag',
  }
  const root = {
    type: 'Document',
    children: []
  }
  const elementStack = [root]
  for (let i = 0; i < n; i++) {
    const token = tokens[i]
    const { type, content, attributes } = token
    if (type === 'openTag' || type === 'selfClosingTag') {
      const parentElement = elementStack[elementStack.length - 1]
      const element = attributes !== void 0 ? {
        type: 'Element',
        tagName: content,
        attributes
      } : {
        type: 'Element',
        tagName: content,
      }
      if (parentElement.children === void 0) parentElement.children = []
      parentElement.children.push(element)
      if (type === 'openTag') {
        elementStack.push(element)
        stack.push(token)
      }
    } else if (stack[stack.length - 1].type === map[type] && stack[stack.length - 1].content === content) {
      stack.pop()
      elementStack.pop()
    } else {
      return null
    }
  }
  return stack.length === 0 ? root : null
}

module.exports = {
  isMatched,
  buildTree
}