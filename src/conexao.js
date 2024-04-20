const knex = require('knex')({
    client: 'pg',
    connection: process.env.POSTGRES_URL,
});

module.exports = knex;
