import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiVersion: 'v1',
  businessName: 'Apex Mobility & Cycle Works',
  businessContact: {
    email: 'support@apexmobility.io',
    phone: '+1 (555) 234-5678',
    hours: 'Mon-Sat: 08:00 - 18:00 PST'
  }
};
