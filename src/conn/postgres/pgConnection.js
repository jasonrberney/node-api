const pg = require('pg');
require('dotenv').config({ silent: true });

pgConnect = async () => {
    console.log(process.env.PGUSER, process.env.PGHOST, process.env.PGDATABASE, process.env.PGPASSWORD, process.env.PGPORT)

    const pool = new pg.Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT,
        ssl: true
    });
    const client = await pool.connect();
    return client;
}

pgClose = (client) => {
    client.release();
}

module.exports = {pgConnect, pgClose};