import mongoose from 'mongoose';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mongodProcess = null;

const startLocalMongo = async () => {
  return new Promise((resolve) => {
    try {
      const dbPath = path.resolve(__dirname, '../../data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      console.log(`[Database] Attempting to launch local mongod on dbpath: ${dbPath}`);
      mongodProcess = spawn('mongod', ['--dbpath', dbPath, '--port', '27017'], {
        detached: false,
        stdio: 'ignore',
      });

      mongodProcess.on('error', (err) => {
        console.warn(`[Database] Could not spawn local mongod: ${err.message}`);
        resolve(false);
      });

      // Give it 2.5 seconds to start up
      setTimeout(() => {
        resolve(true);
      }, 2500);
    } catch (err) {
      console.warn(`[Database] Error starting local mongod process: ${err.message}`);
      resolve(false);
    }
  });
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[Database] Initial MongoDB connection failed: ${err.message}`);

    // If it's a local uri, try starting local mongod
    if (uri.includes('127.0.0.1') || uri.includes('localhost')) {
      console.log('[Database] Trying to auto-start local mongod daemon...');
      await startLocalMongo();

      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] Successfully connected to local MongoDB: ${conn.connection.host}`);
        return conn;
      } catch (retryErr) {
        console.error(`[Database] MongoDB auto-start connection failed: ${retryErr.message}`);
        console.log('[Database] Note: Ensure MongoDB is running or specify MONGODB_URI in server/.env');
        throw retryErr;
      }
    } else {
      throw err;
    }
  }
};

// Clean exit on termination
process.on('SIGINT', () => {
  if (mongodProcess) {
    mongodProcess.kill();
  }
  process.exit();
});

export default connectDB;
