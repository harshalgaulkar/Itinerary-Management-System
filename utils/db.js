const mysql2 = require('mysql2')

const pool = mysql2.createPool({
    host: 'mysql-333fcb97-harshalgaulkar79-9672.d.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_4JFnj57yj6izasuiIQv',
    database: 'fin'
})

module.exports = pool
