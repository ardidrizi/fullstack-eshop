import test from "node:test";
import assert from "node:assert/strict";

import { resolveApiBaseUrl } from "./api.js";

test("throws in production when VITE_API_URL is missing", () => {
  assert.throws(
    () =>
      resolveApiBaseUrl({
        MODE: "production",
      }),
    /Missing VITE_API_URL in production/,
  );
});

test("falls back to localhost in development when VITE_API_URL is missing", () => {
  assert.equal(
    resolveApiBaseUrl({
      MODE: "development",
    }),
    "http://localhost:5000",
  );
});
