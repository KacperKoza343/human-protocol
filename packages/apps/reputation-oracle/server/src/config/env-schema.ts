import * as Joi from 'joi';
import { Web3Network } from './web3-config.service';

export const envValidator = Joi.object({
  // General
  HOST: Joi.string(),
  PORT: Joi.string(),
  FE_URL: Joi.string(),
  MAX_RETRY_COUNT: Joi.number(),
  QUALIFICATION_MIN_VALIDITY: Joi.number(),
  NDA_URL: Joi.string().required(),
  // Auth
  JWT_PRIVATE_KEY: Joi.string().required(),
  JWT_PUBLIC_KEY: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number(),
  VERIFY_EMAIL_TOKEN_EXPIRES_IN: Joi.number(),
  FORGOT_PASSWORD_TOKEN_EXPIRES_IN: Joi.number(),
  // hCaptcha
  HCAPTCHA_SITE_KEY: Joi.string().required(),
  HCAPTCHA_SECRET: Joi.string().required(),
  HCAPTCHA_PROTECTION_URL: Joi.string().description(
    'Hcaptcha URL for verifying guard tokens',
  ),
  HCAPTCHA_LABELING_URL: Joi.string().description('hcaptcha labeling url'),
  HCAPTCHA_API_KEY: Joi.string()
    .required()
    .description('Account api key at hcaptcha foundation'),
  HCAPTCHA_DEFAULT_LABELER_LANG: Joi.string(),
  // Database
  POSTGRES_HOST: Joi.string(),
  POSTGRES_USER: Joi.string(),
  POSTGRES_PASSWORD: Joi.string(),
  POSTGRES_DATABASE: Joi.string(),
  POSTGRES_PORT: Joi.string(),
  POSTGRES_SSL: Joi.string(),
  POSTGRES_URL: Joi.string(),
  POSTGRES_LOGGING: Joi.string(),
  // Web3
  WEB3_ENV: Joi.string().valid(...Object.values(Web3Network)),
  WEB3_PRIVATE_KEY: Joi.string().required(),
  GAS_PRICE_MULTIPLIER: Joi.number(),
  RPC_URL_SEPOLIA: Joi.string(),
  RPC_URL_POLYGON: Joi.string(),
  RPC_URL_POLYGON_AMOY: Joi.string(),
  RPC_URL_BSC_MAINNET: Joi.string(),
  RPC_URL_BSC_TESTNET: Joi.string(),
  RPC_URL_MOONBEAM: Joi.string(),
  RPC_URL_XLAYER_TESTNET: Joi.string(),
  RPC_URL_XLAYER: Joi.string(),
  RPC_URL_LOCALHOST: Joi.string(),
  // S3
  S3_ENDPOINT: Joi.string(),
  S3_PORT: Joi.string(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET: Joi.string(),
  S3_USE_SSL: Joi.string(),
  // Email
  SENDGRID_API_KEY: Joi.string(),
  EMAIL_FROM: Joi.string(),
  EMAIL_FROM_NAME: Joi.string(),
  // Reputation Level
  REPUTATION_LEVEL_LOW: Joi.number(),
  REPUTATION_LEVEL_HIGH: Joi.number(),
  // Encryption
  PGP_PRIVATE_KEY: Joi.string().optional(),
  PGP_PASSPHRASE: Joi.string().optional(),
  PGP_ENCRYPT: Joi.string(),
  // Kyc
  KYC_API_KEY: Joi.string(),
  KYC_API_PRIVATE_KEY: Joi.string().required(),
  KYC_BASE_URL: Joi.string(),

  // Human App
  HUMAN_APP_EMAIL: Joi.string().email().required(),
});
