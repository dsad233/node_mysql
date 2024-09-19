import dotenv from "dotenv";
dotenv.config();

export const ENV_DB_HOST = process.env.DB_HOST;
export const ENV_DB_PORT = Number(process.env.DB_PORT);
export const ENV_DB_USER = process.env.DB_USER;
export const ENV_DB_PASSWORD = process.env.DB_PASSWORD;
export const ENV_DB_DATABASE = process.env.DB_DATABASE;

export const ENV_JWT_SECRET = process.env.JWT_SECRET;
export const ENV_REFRESH_SECRET = process.env.REFRESH_SECRET;
export const ENV_PASSWORD_SALT = Number(process.env.PASSWORD_SALT);

export const ENV_MAILER_HOST = process.env.MAILER_HOST;
export const ENV_MAILER_PORT = Number(process.env.MAILER_PORT);
export const ENV_MAILER_EMAIL = process.env.MAILER_EMAIL;
export const ENV_MAILER_PASSWORD = process.env.MAILER_PASSWORD;
export const ENV_ADMIN_MAILER = process.env.ADMIN_MAILER;

