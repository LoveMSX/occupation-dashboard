
type Environment = 'development' | 'staging' | 'production';

// Determine the environment based on the URL or env var
const determineEnvironment = (): Environment => {
  if (import.meta.env.VITE_APP_ENV) {
    return import.meta.env.VITE_APP_ENV as Environment;
  }
  
  const hostname = window.location.hostname;
  if (hostname.includes('staging')) {
    return 'staging';
  } else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return 'development';
  } else {
    return 'production';
  }
};

// Configuration based on environment
const environments = {
  development: {
    apiUrl: "http://localhost:3000/api",
    debug: true,
  },
  staging: {
    apiUrl: "https://staging.example.com/api",
    debug: true,
  },
  production: {
    apiUrl: "https://api.example.com/api",
    debug: false,
  }
};

// App-wide configuration
const appConfig = {
  appName: "Employee Manager",
  apiTimeout: 30000,
};

// Additional configuration including AI API key
const additionalConfig = {
  aiApiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  aiModels: {
    default: "gpt-3.5-turbo",
    advanced: "gpt-4",
    vision: "gpt-4-vision-preview"
  }
};

// Combine configurations
const env = determineEnvironment();
const config = {
  ...environments[env],
  ...appConfig,
  ...additionalConfig,
  env
};

export default config;
