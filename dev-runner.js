import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('----------------------------------------------------');
console.log('🚀 Starting Mohamed Alaa Portfolio Dev Environment...');
console.log('----------------------------------------------------');

// Start backend server
const server = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, 'server'),
  stdio: 'pipe',
  shell: true,
});

server.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[SERVER]\x1b[0m ${data}`);
});

server.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[SERVER ERROR]\x1b[0m ${data}`);
});

// Start client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, 'client'),
  stdio: 'pipe',
  shell: true,
});

client.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[CLIENT]\x1b[0m ${data}`);
});

client.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[CLIENT LOG]\x1b[0m ${data}`);
});

const cleanup = () => {
  console.log('\nShutting down dev servers...');
  server.kill('SIGTERM');
  client.kill('SIGTERM');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
