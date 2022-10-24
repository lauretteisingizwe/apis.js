const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: "WALLET"
})

module.exports = client
