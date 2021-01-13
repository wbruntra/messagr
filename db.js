const knex = require('knex')
const config = require('./config/config')[process.env.NODE_ENV || 'development']

const client = knex({
  client: 'mysql2',
  connection: {
    user: config.username,
    password: config.password,
    database: config.database,
    host: config.host,
    port: config.port,
  },
})

const getMessages = async () => {
  return client
    .select()
    .from('Messages')
    .where({
      sender: 'bill',
    })
    .orWhere({
      recipient: 'bill',
    })
}

module.exports = { client }
