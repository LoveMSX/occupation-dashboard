const config = {
  common: {
    appName: "Employee Manager",
    apiTimeout: 30000,
  },
  development: {
    apiUrl: "http://localhost:3000/api", // Vérifiez que le port correspond à votre serveur
    debug: true,
  },
  staging: {
    apiUrl: "https://staging.example.com/api",
    debug: true,
  },
  production: {
    apiUrl: "https://api.example.com/api",
    debug: false,
  },
  features: {
    enableAnalytics: false,
    experimentalFeatures: ["occupancyForecast"],
  },
} as const;

export type AppConfig = typeof config;
export type Environment = 'development' | 'staging' | 'production';
export type EnvironmentConfig = (typeof config)[Environment];

export default {
  ...config.common,
  ...config[process.env.NODE_ENV as Environment || 'development'],
  env: process.env.NODE_ENV as Environment || 'development',
} as AppConfig[Environment] & typeof config.common & { env: Environment };
