export const CORS_ALLOWED_URLS = () => {
  const defaultURLS: Array<string> = [
    'https://newmbani.co.ke',
    'https://demo.newmbani.co.ke',
    'https://app.newmbani.co.ke',
    'http://localhost:4200',
    'https://newmbani.bdcomputing.co.ke',
  ];
  // create an array of origins from the urls
  const split: Array<string> = (process.env.CORS_ALLOWED_URLS ?? '').split(',');
  return split.length > 0 ? split : defaultURLS;
};
