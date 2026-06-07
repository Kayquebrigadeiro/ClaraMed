import { spawn } from 'node:child_process';
import process from 'node:process';
import path from 'node:path';

const rootDir = process.cwd();
const backendDir = path.join(rootDir, 'backend');

const children = [];

const start = (label, command, args, options = {}) => {
  const child = spawn(command, args, {
    cwd: options.cwd ?? rootDir,
    env: { ...process.env, ...options.env },
    shell: true,
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (code !== 0 && signal !== 'SIGTERM') {
      console.error(`[${label}] encerrou com código ${code ?? signal}`);
      shutdown(code ?? 1);
    }
  });

  children.push(child);
  return child;
};

const shutdown = (code = 0) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  setTimeout(() => process.exit(code), 200);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('API', 'mvnw.cmd', ['spring-boot:run'], {
  cwd: backendDir,
  env: { SPRING_PROFILES_ACTIVE: 'dev' },
});

start('WEB', 'vite', [], {
  cwd: rootDir,
});
