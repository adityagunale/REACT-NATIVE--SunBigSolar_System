const config = {
  development: {
    apiUrl: 'http://192.168.43.42:8000',
  },
  production: {
    // Replace this with your production backend URL when deployed
    apiUrl: 'https://your-production-backend.com',
  },
};

const getApiUrl = () => {
  if (__DEV__) {
    return config.development.apiUrl;
  }
  return config.production.apiUrl;
};

export default {
  getApiUrl,
}; 