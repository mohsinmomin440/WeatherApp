import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  // Connect to Database (graceful with fallback if local mongo is off)
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`\n=================================================`);
    console.log(` SkyCast API Server running on port ${env.PORT}`);
    console.log(` Environment: ${env.NODE_ENV}`);
    console.log(` Health Check: http://localhost:${env.PORT}/api/v1/health`);
    console.log(` Weather Search: http://localhost:${env.PORT}/api/v1/weather/search?q=London`);
    console.log(`=================================================\n`);
  });

  return server;
};

startServer();
