import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ${config.businessName} API is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📑 OpenAPI Spec: http://localhost:${PORT}/openapi.json`);
  console.log(`📖 Swagger UI Docs: http://localhost:${PORT}/docs`);
  console.log(`====================================================`);
});
