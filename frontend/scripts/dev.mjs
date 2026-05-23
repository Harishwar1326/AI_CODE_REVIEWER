import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(frontendRoot, "..");
const backendEntry = path.resolve(repoRoot, "api", "backend", "server.js");
const viteEntry = path.resolve(
  repoRoot,
  "node_modules",
  "vite",
  "bin",
  "vite.js",
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function startProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  return child;
}

function isPortOpen(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: "127.0.0.1" });

    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });

    socket.once("error", () => {
      resolve(false);
    });

    socket.setTimeout(500, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const backendRunning = await isPortOpen(3000);

  let backendProcess = null;

  if (!backendRunning) {
    backendProcess = startProcess(process.execPath, [backendEntry], {
      cwd: path.dirname(backendEntry),
    });
  } else {
    console.log("Backend already running on port 3000.");
  }

  const frontendProcess = startProcess(process.execPath, [viteEntry], {
    cwd: frontendRoot,
  });

  const shutdown = (signal) => {
    for (const child of [frontendProcess, backendProcess]) {
      if (child && !child.killed) {
        child.kill(signal);
      }
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  const exitCode = await Promise.race([
    new Promise((resolve) => frontendProcess.once("exit", resolve)),
    backendProcess
      ? new Promise((resolve) => backendProcess.once("exit", resolve))
      : new Promise(() => {}),
  ]);

  shutdown("SIGTERM");

  process.exit(typeof exitCode === "number" ? exitCode : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
