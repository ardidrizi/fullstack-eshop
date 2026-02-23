const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("node:http");
const mongoose = require("mongoose");

const app = require("../app");

const jsonRequest = (server, method, path) =>
  new Promise((resolve, reject) => {
    const req = request.request(
      {
        hostname: "127.0.0.1",
        port: server.address().port,
        method,
        path,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            body: raw ? JSON.parse(raw) : null,
          });
        });
      }
    );

    req.on("error", reject);
    req.end();
  });

let server;
test.before(() => {
  server = app.listen(0);
});

test.after(() => {
  server.close();
});

test("GET /health returns ok payload", async () => {
  const response = await jsonRequest(server, "GET", "/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);
  assert.equal(typeof response.body.uptime, "number");
  assert.equal(typeof response.body.timestamp, "string");
  assert.equal(typeof response.body.env, "string");
});

test("GET /ready returns 200 when mongoose is connected", async () => {
  const originalReadyState = mongoose.connection.readyState;
  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    get: () => 1,
  });

  const response = await jsonRequest(server, "GET", "/ready");

  assert.equal(response.status, 200);
  assert.equal(response.body.ok, true);

  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    get: () => originalReadyState,
  });
});

test("GET /ready returns 503 when mongoose is disconnected", async () => {
  const originalReadyState = mongoose.connection.readyState;
  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    get: () => 0,
  });

  const response = await jsonRequest(server, "GET", "/ready");

  assert.equal(response.status, 503);
  assert.equal(response.body.ok, false);

  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    get: () => originalReadyState,
  });
});
