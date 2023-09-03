const net = require('node:net')
const ResponseParser = require('./responseParser/ResponseParser.class')
const client = net.createConnection({ port: 8000 }, () => {
  console.log('connected')
  /**
   * request line
   * method: GET 
   * path: /
   * http: version
   * 
   * request header
   * key: value pair : \r\n
   * 
   * request body
   * get emmpty body
   * post
   */
  client.write('POST / HTTP/1.1\r\n')
  client.write('content-type: application/json\r\n')
  client.write('Host: 127.0.0.1\r\n')
  client.write('\r\n')
  client.write('{"field1":"aaa","code":"x=1"}')
})

// client.on('data', (data) => {
  // console.log(data.toString())
  // console.log(statemachine(data.toString()))
  // client.end()
// })

// client.on('end', () => {
  // console.log('disconnected from server')
// })

client.pipe(new ResponseParser())
