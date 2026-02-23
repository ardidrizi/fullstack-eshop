import { spawn } from "node:child_process";

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForServer = async (attempts = 30) => {
  for (let i = 0; i < attempts; i += 1) {
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

const devServer = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)], {
  stdio: "ignore",
  shell: true,
});

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
  devServer.kill("SIGTERM");
}
