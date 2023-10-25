import * as Joi from 'joi';

export const ConfigNames = {
  HOST: 'HOST',
  PORT: 'PORT',
  WEB3_PRIVATE_KEY: 'WEB3_PRIVATE_KEY',
  REPUTATION_ORACLE_URL: 'REPUTATION_ORACLE_URL',
  S3_ENDPOINT: 'S3_ENDPOINT',
  S3_PORT: 'S3_PORT',
  S3_ACCESS_KEY: 'S3_ACCESS_KEY',
  S3_SECRET_KEY: 'S3_SECRET_KEY',
  S3_BUCKET: 'S3_BUCKET',
  S3_USE_SSL: 'S3_USE_SSL',
  LIQUIDITY_ORACLE_URL:'LIQUIDITY_ORACLE_URL',
  UniswapEthereumEndpoint:'UniswapEthereumEndpoint',
  UniswapPolygonEndpoint: 'UniswapPolygonEndpoint',
  pancakeSwapEndpoint: 'pancakeSwapEndpoint' ,

};

export const envValidator = Joi.object({
  HOST: Joi.string().default('localhost'),
  PORT: Joi.string().default(3002),
  WEB3_PRIVATE_KEY: Joi.string(),
  // S3
  S3_ENDPOINT: Joi.string().default('127.0.0.1'),
  S3_PORT: Joi.string().default(9000),
  S3_ACCESS_KEY: Joi.string(),
  S3_SECRET_KEY: Joi.string(),
  S3_BUCKET: Joi.string().default('solution'),
  S3_USE_SSL: Joi.string().default(false),
  LIQUIDITY_ORACLE_URL:Joi.string().default('https://future-infusion-392601.oa.r.appspot.com'),
  UniswapEthereumEndpoint:Joi.string().default('https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum'),
  UniswapPolygonEndpoint: Joi.string().default('https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-polygon'),
  pancakeSwapEndpoint:Joi.string().default('https://api.thegraph.com/subgraphs/name/messari/pancakeswap-v3-bsc')

});
