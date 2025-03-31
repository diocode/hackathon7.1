import { Platform } from 'react-native';

const AWS_CONFIG = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: process.env.AWS_DATABASE_ENDPOINT,
  port: 5432,
  database: process.env.AWS_DATABASE_NAME,
};

const API_URL = process.env.AWS_API_GATEWAY_URL;

export { AWS_CONFIG, API_URL }; 