export enum RedisNamespaces {
  SUBSCRIBER = 'SUB:',
  PUBLISHER = 'PUB:',
  RATE_LIMIT = 'RATE_LIMIT:',
}

export enum RateLimitingInterval {
  HOURLY = 'HOURLY',
  MINUTE = 'MINUTE',
}
