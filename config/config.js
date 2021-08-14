const {config} = require("dotenv");

config();

export const PORT = process.env.APP_PORT;
export const DB = process.env.APP_DB;
export const SECRET = process.env.APP_SECRET;
export const SENDGRID_API = process.env.SENDGRID_API;
export const HOST_EMAIL = process.env.APP_HOST_EMAIL;
export const DOMAIN = process.env.APP_DOMAIN;

