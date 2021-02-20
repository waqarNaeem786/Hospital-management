const Pool = require("pg").Pool;

const pool = new Pool({
  user: 'postgres',
  password: 'iAmPk',
  host: "localhost",
  port: 5432,
  database: 'blog'
});

module.exports = pool;