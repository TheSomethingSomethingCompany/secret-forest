// db.js

// write `const db=require('../db-connection.js') in every route file

const pgp = require('pg-promise')();

const cn = {
    host: 'localhost', // the service name from docker-compose.yml
    port: 5432,
    database: 'postgres', 
    user: 'postgres',
    password: 'postgres'
};

const db = pgp(cn);

module.exports = db;


