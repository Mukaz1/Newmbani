export const GenerateRedisURL = () => {
  const hasPassword = process.env.REDIS_HAS_PASSWORD
    ? JSON.parse(process.env.REDIS_HAS_PASSWORD)
    : false;

  const selfHosted: boolean = process.env.REDIS_SELF_HOSTED
    ? JSON.parse(process.env.REDIS_SELF_HOSTED)
    : false;
  const REDIS_HOST = process.env.REDIS_HOST;
  const REDIS_PORT = +process.env.REDIS_PORT;
  const REDIS_USERNAME = process.env.REDIS_USERNAME;
  const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
  const base = selfHosted ? 'redis://' : 'rediss://';

  let REDIS_URL = hasPassword
    ? `${base}${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
    : `${base}${REDIS_HOST}:${REDIS_PORT}`;

  REDIS_URL = `${REDIS_URL}${selfHosted === true ? '/0' : ''}`;
  return REDIS_URL;
};
