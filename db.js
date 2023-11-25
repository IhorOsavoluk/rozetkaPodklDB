const {Pool} =require('pg')
const pool = new Pool({
    host:'host.docker.internal',
    port:5453,
    user: 'postgres',
    password: 'password',
    database:'postgres'
})

module.exports = pool