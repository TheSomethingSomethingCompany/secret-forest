const pgp = require('pg-promise')();

const cn = {
    host: 'aws-0-ca-central-1.pooler.supabase.com',
	port: 5432,
    database: 'postgres', 
    user: 'postgres.tmeseckyonsoxkmspewp',
    password: 'postgres@499'
};

const db = pgp(cn);

module.exports = db;


