// Configuración de entorno para desarrollo
export const environment = {
  production: false,
  appName: 'Box Training',
  version: '1.0.0',
  apiUrl: 'http://localhost:3000/api', // Para futuro backend
  enableMockData: true,
  debugMode: true,
  features: {
    enableNotifications: true,
    enablePayments: false, // Para implementación futura
    enableChat: false,     // Para implementación futura
    enableReports: true
  },
  ui: {
    theme: 'default',
    language: 'es',
    itemsPerPage: 10,
    autoSave: true
  }
};
