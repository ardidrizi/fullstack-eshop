import { spawn } from "node:child_process";

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm";

const devServer = spawn(
  npmExecutable,
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)],
  {
    stdio: "ignore",
  }
);

let devServerExited = false;
let devServerExitCode = null;

const serverExitPromise = new Promise((resolve) => {
  devServer.on("exit", (code) => {
    devServerExited = true;
    devServerExitCode = code;
    resolve(code);
  });
});

const waitForServer = async (attempts = 60) => {
  for (let i = 0; i < attempts; i += 1) {
    if (devServerExited) {
      throw new Error(`Vite dev server exited before becoming ready (code: ${devServerExitCode})`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return response;
      }
    } catch {
      // ignore until server is ready
    }

    await wait(500);
  }

  throw new Error("Vite dev server did not start in time");
};

try {
  const response = await waitForServer();
  const html = await response.text();

  if (!html.includes('<div id="root"></div>')) {
    throw new Error("Expected root container was not found on the home page");
  }

  if (!html.includes('/src/main.jsx')) {
    throw new Error("Expected app entry script not found on the home page");
  }

  console.log("Smoke test passed: client app serves the homepage shell.");
} finally {
  if (!devServerExited) {
    devServer.kill("SIGTERM");
    await Promise.race([serverExitPromise, wait(2000)]);

    if (!devServerExited) {
      devServer.kill("SIGKILL");
    }
  }
}
