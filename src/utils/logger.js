export const logEvent = (eventCode, details) => {
  const timestamp = new Date().toISOString();
  console.log(`[${eventCode}] ${details} - Time: ${timestamp}`);
};

export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR] ${context} - ${error.message} - Time: ${timestamp}`);
};

export const logInfo = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[INFO] ${message} - Time: ${timestamp}`);
};