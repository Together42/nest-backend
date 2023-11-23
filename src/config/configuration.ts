import 'dotenv/config';
import * as process from 'process';

export default () => ({
  database: {
    DB_HOST: process.env.MYSQL_HOST || 'localhost',
    DB_PORT: process.env.MYSQL_PORT || '3306',
    DB_USER: process.env.MYSQL_USER || 'default',
    DB_PASSWORD: process.env.MYSQL_PASSWORD || 'default',
    DB_DATABASE: process.env.MYSQL_DATABASE || 'default',
    DB_SYNC: process.env.NODE_ENV === 'prod' ? 'false' : 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'default',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'default',
    callbackUrl: process.env.GOOGLE_REDIRECT_URI || 'default',
    prompt: process.env.GOOGLE_PROMPT || '',
  },
  openApi: {
    serviceKey: process.env.SERVICE_KEY || '',
  },
});
