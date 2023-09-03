# yzhanHTMLParser
[![npm](https://img.shields.io/npm/v/yzhanhtmlparser)](https://www.npmjs.com/package/yzhanhtmlparser)
[![npm](https://img.shields.io/npm/dt/yzhanhtmlparser)](https://www.npmjs.com/package/yzhanhtmlparser)
[![GitHub license](https://img.shields.io/github/license/mantoufan/yzhanhtmlparser)](https://github.com/mantoufan/yzhanhtmlparser/blob/main/LICENSE)
![coverage](https://img.shields.io/badge/coverage-100%25-green)  
A streaming HTML parser based on [HTML Standard](https://html.spec.whatwg.org/multipage/parsing.html)  
一款基于 HTML 标准的流式 HTML 解析器
## Demo
You could change HTML Code and view the result in realtime.  
[Online Demo](https://mantoufan.github.io/yzhanHTMLParser)  
![DEMO PNG](https://s2.loli.net/2023/09/03/P1qDoBy6uRnh28Y.png)
## Setup
### Node.js
```javascript
npm i yzhanhtmlparser
import yzhanHTMLParser from 'yzhanhtmlparser'
```
### Browser
```html
<script src="https://cdn.jsdelivr.net/npm/yzhanhtmlparser@latest/docs/yzhanhtmlparser.min.js"></script>
```
## Usage
### Declaration Code
```javascript
const code = `<html lang="en">
<head>
<title>Page Name</title>
<meta charset="UTF-8">
</head>
<body>
<h1 class="text" id=a>Hello World</h1>
<input type="button" disabled/>
</body>`
```
### Parser · Prase
```javascript 
const parseResult = yzhanHTMLParser.parse(code)
```
### Streaming Usage
```javascript
const fs = require('node:fs')
const htmlParser = new yzhanHTMLParser.HtmlParser()
/* data.txt: abcde */
fs.createReadStream('./data.txt').pipe(htmlParser)
htmlParser.on('data', char => {
  console.log(char) // a . b . c . d . e
})
```
## Development
### Unit Testing
```shell
npm test
```
### Unit Testing Coverage
```shell
npm run test:coverage
```
### Build
```shell
npm run build
```
### Preview
```shell
npm run dev
```