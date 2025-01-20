const dotenv = require('dotenv');
dotenv.config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ZOOKEEPER_EMAIL,
  ZOOKEEPER_PASSWORD,APP_EMAIL,
  APP_PWD,
  APP_HEADER,
  SERVER_PORT
} = process.env;

const isProduction = NODE_ENV === 'production';

const config = {
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  seederStorage: 'sequelize',
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
  appport: SERVER_PORT,
  nodeenvironment: NODE_ENV,
  jwtsecret: JWT_SECRET,
  jwtexpiresin: JWT_EXPIRES_IN,
  zookeeperemail: ZOOKEEPER_EMAIL,
  zookeeperpassword: ZOOKEEPER_PASSWORD,
  appemail: APP_EMAIL,
  apppwd: APP_PWD,
  appheader: APP_HEADER
};

module.exports = config;
