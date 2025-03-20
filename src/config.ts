
// Different configurations based on environment
interface Config {
  apiUrl: string;
  debug: boolean;
  appName: string;
  apiTimeout: number;
  env: 'development' | 'staging' | 'production';
  aiApiKey?: string; // Optional AI API key
}

// Define the different configs
const configs = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    appName: 'Employee Manager',
    apiTimeout: 30000,
    env: 'development' as const,
    aiApiKey: process.env.VITE_AI_API_KEY || 'sk-demo-key'
  },
  staging: {
    apiUrl: 'https://staging.example.com/api',
    debug: true,
    appName: 'Employee Manager',
    apiTimeout: 30000,
    env: 'staging' as const,
    aiApiKey: process.env.VITE_AI_API_KEY
  },
  production: {
    apiUrl: 'https://api.example.com/api',
    debug: false,
    appName: 'Employee Manager',
    apiTimeout: 30000,
    env: 'production' as const,
    aiApiKey: process.env.VITE_AI_API_KEY
  }
};

// Determine which config to use
const env = process.env.NODE_ENV || 'development';
const config: Config = configs[env as keyof typeof configs] || configs.development;

export default config;
