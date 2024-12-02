import app from './app.js';
import { testConnection } from './db/connection.js';

async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Shutting down.');
      process.exit(1);
    }

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

startServer();