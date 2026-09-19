// Use the configured public API in production; local development retains the existing port.
export const API_BASE=(import.meta.env.VITE_API_BASE_URL||'http://localhost:53128/api').replace(/\/$/,'');
