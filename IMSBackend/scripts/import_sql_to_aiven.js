#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
require('dotenv').config()

async function findLocalPem() {
  const files = fs.readdirSync(process.cwd())
  const pem = files.find(f => f.toLowerCase().endsWith('.pem'))
  if (pem) return fs.readFileSync(path.join(process.cwd(), pem))
  return null
}

function getSqlFilesFromArgsOrRoot(args) {
  if (args.length > 0) return args.map(a => path.resolve(a))
  // pick top-level .sql files in repo root
  return fs.readdirSync(process.cwd())
    .filter(f => f.toLowerCase().endsWith('.sql'))
    .map(f => path.resolve(f))
}

async function main() {
  const DB_HOST = process.env.DB_HOST
  const DB_PORT = process.env.DB_PORT || 3306
  const DB_USER = process.env.DB_USER
  const DB_PASSWORD = process.env.DB_PASSWORD
  const DB_NAME = process.env.DB_NAME
  const DB_SSL = process.env.DB_SSL === 'true'
  const DB_SSL_REJECT_UNAUTHORIZED = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('Missing required DB env vars. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME')
    process.exit(1)
  }

  let caBuffer = null
  if (process.env.DB_SSL_CA) {
    try {
      caBuffer = Buffer.from(process.env.DB_SSL_CA, 'base64')
      console.log('Using DB_SSL_CA from env (base64)')
    } catch (err) {
      console.warn('Failed to decode DB_SSL_CA from env:', err.message)
    }
  }

  if (!caBuffer && DB_SSL) {
    const local = await findLocalPem()
    if (local) {
      caBuffer = local
      console.log('Using local PEM file found in repository root')
    }
  }

  const ssl = DB_SSL ? (caBuffer ? { ca: caBuffer, rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED } : { rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED }) : undefined

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    ssl,
    multipleStatements: true,
    // increase timeout for large imports
    connectTimeout: 10000,
  })

  const files = getSqlFilesFromArgsOrRoot(process.argv.slice(2))
  if (files.length === 0) {
    console.log('No SQL files found to import.')
    await connection.end()
    return
  }

  try {
    for (const file of files) {
      console.log('Importing', file)
      const sql = fs.readFileSync(file, { encoding: 'utf8' })
      if (!sql.trim()) {
        console.log('Skipping empty file', file)
        continue
      }
      // Execute file content; multipleStatements must be enabled
      await connection.query(sql)
      console.log('Imported', path.basename(file))
    }
    console.log('All imports completed')
  } catch (err) {
    console.error('Error during import:', err.message)
  } finally {
    await connection.end()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
