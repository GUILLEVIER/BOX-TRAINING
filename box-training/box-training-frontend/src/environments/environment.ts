// Configuración de entorno para producción
export const environment = {
  production: true,
  appName: 'Box Training',
  version: '1.0.0',
  apiUrl: 'https://api.boxtraining.com/api', // URL de producción
  enableMockData: false,
  debugMode: false,
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
