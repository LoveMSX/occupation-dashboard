// Create a new utility for logging with timestamps
export const logWithTimestamp = (...args: any[]) => {
  try {
    console.log(`[${new Date().toISOString()}]`, ...args);
  } catch (error) {
    console.error('Logging error:', error);
  }
};

// Utility for error logging
export const logError = (error: Error, context?: string) => {
  try {
    console.error(
      `[${new Date().toISOString()}] Error${context ? ` in ${context}` : ''}:`,
      error.message,
      error.stack
    );
  } catch (loggingError) {
    console.error('Failed to log error:', loggingError);
  }
};

// Optional: Initialize logging utilities when needed
export const initializeLogger = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Logger initialized in development mode');
  }
};
