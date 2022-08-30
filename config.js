require('dotenv').config({ path: './secret.env' });

module.exports = {
  server: {
    host: process.env.SERVER_HOST || 'localhost',
    port: process.env.SERVER_PORT || 3500,
    domain: process.env.SERVER_DOMAIN || 'localhost:3500',
  },
  mysql: {
    user: process.env.DB_USER || 'root',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'tdbovid_ru',
    password: process.env.DB_PASS || '',
    port: process.env.DB_PORT || 3306,
    connectionLimit: process.env.CONNECTION_LIMIT || 10,
    prefix: process.env.DB_TABLE_PREFIX || '',
  },
  log: {
    file: 'app.log',
  },
};
