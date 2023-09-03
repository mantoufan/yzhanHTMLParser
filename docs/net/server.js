const http = require('node:http')
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1 class="text" id=a>Hello World</h1><img id="b"/>')
})

server.listen(8000)