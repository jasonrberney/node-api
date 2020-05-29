const { Connection } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: process.env.SQLUSER, // update me
      password: process.env.SQLPASSWORD // update me
    },
    type: "default"
  },
  server: process.env.SQLSERVER, // update me
  options: {
    database: process.env.SQLDATABASE, //update me
    encrypt: true
  }
};

tediousConnect = async () => {
  const connection = new Connection(config);
  return connection;
}
// TEST
module.exports = { tediousConnect };
