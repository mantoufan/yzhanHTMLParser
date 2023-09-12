const { isMatched, buildDOMTree } = require('../utils')
const { parse } = require('../src')
describe('PushdownAutoStateMachine', () => {
  it('check tag is matched', () => {
    const tokens = parse(
      '<div><h1><b></b><a></a></h1></ div><img/><a></a>'
    )
    /*
      {"type":"openTag","content":"div"},
      {"type":"closeTag","content":"div"},
      {"type":"selfClosingTag","content":"img"},
      {"type":"openTag","content":"a"},
      {"type":"closeTag","content":"a"}
    */
    expect(isMatched(tokens)).toBe(true)
  }) 

  it('build DOM tree', () => {
    const tokens = parse(
      '<div class="a"><h1><b class="b"></b><a></a></h1></ div><img/><a></a>'
    )
    expect(buildDOMTree(tokens)).toEqual({"children": [{"attributes": {"class": "a"}, "children": [{"children": [{"attributes": {"class": "b"}, "tagName": "b", "type": "Element"}, {"tagName": "a", "type": "Element"}], "tagName": "h1", "type": "Element"}], "tagName": "div", "type": "Element"}, {"tagName": "img", "type": "Element"}, {"tagName": "a", "type": "Element"}], "type": "Document"})
  }) 
})