const HtmlParser = require('./htmlParser/HtmlParser.class')
const StringStream = require('./htmlParser/StringStream.class')
const Collector = require('./htmlParser/Collector.class')
const { isMatched, buildDOMTree } = require('../utils')

module.exports = {
  HtmlParser,
  parse(html) {
     const htmlParser = new HtmlParser()
     const stringStream = new StringStream(html)
     stringStream.pipe(htmlParser)
     const collector = new Collector()
     htmlParser.on('data', str => collector.write(str))
     stringStream.read()
     return collector.data.map(data => JSON.parse(data))
  },
  isMatched(html) {
    const tokens = this.parse(html)
    return isMatched(tokens)
  },
  buildDOMTree(html) {
    const tokens = this.parse(html)
    return buildDOMTree(tokens)
  }
}