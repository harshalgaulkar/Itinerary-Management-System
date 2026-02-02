#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

function findPemFile() {
  const files = fs.readdirSync(process.cwd())
  const pem = files.find(f => f.toLowerCase().endsWith('.pem'))
  return pem || null
}

function generateEnv(pemFile, base64) {
  return `# Aiven DB env (generated)
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=25060
DB_USER=youruser
DB_PASSWORD=yourpass
DB_NAME=Fin
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA=${base64}
`}

function main() {
  const pem = findPemFile()
  if (!pem) {
    console.error('No .pem file found in repository root. Place your CA PEM in the repo root and retry.')
    process.exit(1)
  }

  const pemPath = path.join(process.cwd(), pem)
  const pemBuf = fs.readFileSync(pemPath)
  const b64 = pemBuf.toString('base64')

  const envContent = generateEnv(pem, b64)
  const outPath = path.join(process.cwd(), '.env.aiven')
  fs.writeFileSync(outPath, envContent, { encoding: 'utf8', flag: 'w' })
  console.log('Wrote', outPath)
  console.log('Keep this file secret. Do NOT commit to git.')
}

main()
