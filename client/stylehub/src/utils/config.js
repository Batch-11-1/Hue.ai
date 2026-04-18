const config = {
  backendBaseUrl: (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000').replace(/\/$/, ''),
};

export default config;
