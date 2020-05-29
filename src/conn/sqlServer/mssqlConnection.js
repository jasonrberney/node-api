const sql = require('mssql');

const config = {
    user: process.env.SQLUSER,
    password: process.env.SQLPASSWORD,
    server: process.env.SQLSERVER,
    database: process.env.SQLDATABASE
}

// mssqlConnect must be closed after each connection; we are using the pool below this function which remains open for requests
mssqlConnect = async () => {
    let mssqlConn = await sql.connect(config);
    return mssqlConn;
}

const mssqlPool = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = { mssqlConnect, mssqlPool };