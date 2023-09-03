const { parse } = require('../src')
describe('Test HTML Parser', () => {
  const parseStringToCollector = (template, enableLog) => {
    const tokens = parse(template)
    if (enableLog !== void 0) console.log(tokens)
    return tokens
  }
  it('Test tagOpen, tagEnd', () => {
    expect(parseStringToCollector(
      '<h1 class="text" id=a>Hello World</h1>'
    )).toEqual(
      [
        {"type":"openTag","content":"h1","attributes":{"class":"text","id":"a"}},
        {"type":"char","content":"H"},
        {"type":"char","content":"e"},
        {"type":"char","content":"l"},
        {"type":"char","content":"l"},
        {"type":"char","content":"o"},
        {"type":"char","content":" "},
        {"type":"char","content":"W"},
        {"type":"char","content":"o"},
        {"type":"char","content":"r"},
        {"type":"char","content":"l"},
        {"type":"char","content":"d"},
        {"type":"closeTag","content":"h1"}
      ]
    )
  })
  it('Test selfClosingStartTag with No Attribute', () => {
    expect(parseStringToCollector(
      '<img/>'
    )).toEqual(
      [ {"type":"selfClosingTag","content":"img"} ]
    )
    expect(parseStringToCollector(
      '<img />'
    )).toEqual(
      [ {"type":"selfClosingTag","content":"img"} ]
    )
    expect(parseStringToCollector(
      '<img / >'
    )).toEqual(
      [ {"type":"selfClosingTag","content":"img"} ]
    )
  })
  it('Test selfClosingStartTag with Attribute: Name only', () => {
    expect(parseStringToCollector(
      '<input disabled/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":"disabled"}}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":"disabled"}}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled/><a></a>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":"disabled"}},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled /><a></a>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":"disabled"}},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled=/><a></a>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":""}},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled= /><a></a>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"input","attributes":{"disabled":""}},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
    expect(parseStringToCollector(
      '<input disabled=></input><a></a>'
    )).toEqual(
      [
        {"type":"openTag","content":"input","attributes":{"disabled":""}},
        {"type":"closeTag","content":"input"},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
  })
  it('Test selfClosingStartTag with Attribute: Name + Value', () => {
    expect(parseStringToCollector(
      '<img id="banner"/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '<img id=\'banner\'/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '<img id=banner/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
  })
  it('Test tagOpen with No Attribute', () => {
    expect(parseStringToCollector(
      '<img></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img"},
        {"type":"closeTag","content":"img"}
      ]
    )
    expect(parseStringToCollector(
      '<img ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img"},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test tagOpen with Attribute', () => {
    expect(parseStringToCollector(
      '<img id="banner"></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ]
    )
    expect(parseStringToCollector(
      '<img id=\'banner\'></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ]
    )
    expect(parseStringToCollector(
      '<img id=banner></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test addional space in tagEnd together with other tags', () => {
    expect(parseStringToCollector(
      '<div></ div><img/><a></a>'
    )).toEqual(
      [
        {"type":"openTag","content":"div"},
        {"type":"closeTag","content":"div"},
        {"type":"selfClosingTag","content":"img"},
        {"type":"openTag","content":"a"},
        {"type":"closeTag","content":"a"}
      ]
    )
  })
  it('Test addional space in Attributes within Dobule Quoted', () => {
    expect(parseStringToCollector(
      '< img  id ="banner"/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id ="banner" />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id ="banner"></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ]
    )
    expect(parseStringToCollector(
      '< img  id ="banner" ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test addional space in Attributes within Single Quoted', () => {
    expect(parseStringToCollector(
      '< img id =\'banner\'/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id =\'banner\' />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id =\'banner\'></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ] 
    )
    expect(parseStringToCollector(
      '< img  id =\'banner\' ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ] 
    )
  })
  it('Test addional space in Attributes within Un Quoted', () => {
    expect(parseStringToCollector(
      '< img  id =banner/>'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ] 
    )
    expect(parseStringToCollector(
      '< img  id =banner />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner"}}
      ] 
    )
    expect(parseStringToCollector(
      '< img  id =banner></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ] 
    )
    expect(parseStringToCollector(
      '< img  id =banner ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner"}},
        {"type":"closeTag","content":"img"}
      ] 
    )
  })

  it('Test addional space in Attributes within Dobule Quoted', () => {
    expect(parseStringToCollector(
      '< img  id ="banner" width="30" height= "20" />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id ="banner" width="30" height= "20" ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test addional space in Attributes within Single Quoted', () => {
    expect(parseStringToCollector(
      '< img  id =\'banner\' width=\'30\' height= \'20\' />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id =\'banner\' width=\'30\' height= \'20\' ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test addional space in Attributes within Un Quoted', () => {
    expect(parseStringToCollector(
      '< img  id =banner width=30 height= 20 />'
    )).toEqual(
      [
        {"type":"selfClosingTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}}
      ]
    )
    expect(parseStringToCollector(
      '< img  id =banner width=30 height= 20 ></img>'
    )).toEqual(
      [
        {"type":"openTag","content":"img","attributes":{"id":"banner","width":"30","height":"20"}},
        {"type":"closeTag","content":"img"}
      ]
    )
  })
  it('Test auto Fixed feature: fragments endTag', () => {
    expect(parseStringToCollector(
      '< img ></>'
    )).toEqual(
      [ {"type":"openTag","content":"img"}, {"type":"closeTag"} ]
    )
  })
})
