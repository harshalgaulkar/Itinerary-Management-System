const http = require('http')
const options = { host: '127.0.0.1', port: 4000, path: '/', method: 'GET', timeout: 2000 }
const req = http.request(options, res => {
  console.log('STATUS', res.statusCode)
  res.setEncoding('utf8')
  res.on('data', chunk => process.stdout.write(chunk))
  res.on('end', () => process.exit(0))
})
req.on('error', e => { console.error('ERR', e.code || e.message); process.exit(2) })
req.on('timeout', () => { console.error('ERR TIMEOUT'); req.abort(); process.exit(3) })
req.end()
