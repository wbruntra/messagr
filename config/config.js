const keys = require('./keys')

module.exports = {
  development: {
    username: 'root',
    password: 'devpw',
    database: 'messagr_dev',
    host: '127.0.0.1',
    port: '3309',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: keys.prod_db_user,
    password: keys.prod_db_password,
    database: keys.prod_db,
    host: '127.0.0.1',
    dialect: 'mysql',
  },
}
