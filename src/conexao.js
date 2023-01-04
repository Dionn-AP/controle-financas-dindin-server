const knex = require('knex')({
    client: 'pg',
    connection: {
        user: process.env.USER_DB,
        host: process.env.HOST_DB,
        database: process.env.DATA_BASE,
        password: process.env.PASSWORD_DB,
    }
});

module.exports = knex;