// const { Pool } = require('pg')
// require('dotenv').config()

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });

// module.exports = pool;

const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATA_BASE
    }
});

// module.exports = knex;

// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//         host: process.env.HOST_DB,
//         user: process.env.USER_DB,
//         password: process.env.PASSWORD_DB,
//         database: process.env.DATA_BASE
//     }
// });

// module.exports = knex;