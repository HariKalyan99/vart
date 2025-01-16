const dotenv = require('dotenv');
dotenv.config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  APP_PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_EMAIL,
  ADMIN_PASSWORD
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
  appport: APP_PORT,
  nodeenvironment: NODE_ENV,
  jwtsecret: JWT_SECRET,
  jwtexpiresin: JWT_EXPIRES_IN,
  adminemail: ADMIN_EMAIL,
  adminpassword: ADMIN_PASSWORD,
};

module.exports = config;
