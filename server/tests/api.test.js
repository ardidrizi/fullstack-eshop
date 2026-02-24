const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("node:http");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret";

const app = require("../app");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");

const users = [];
const products = [];

const resetData = () => {
  users.length = 0;
  products.length = 0;
};

const jsonRequest = (server, method, path, body, token, extraHeaders = {}) =>
  new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = request.request(
      {
        hostname: "127.0.0.1",
        port: server.address().port,
        method,
        path,
        headers: {
          "Content-Type": "application/json",
          ...(payload ? { "Content-Length": Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...extraHeaders,
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          let data = null;
          try {
            data = raw ? JSON.parse(raw) : null;
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });

User.findOne = async ({ email }) => users.find((u) => u.email === email) || null;
User.create = async ({ name, email, password }) => {
  const user = {
    _id: String(users.length + 1),
    name,
    email,
    password,
    role: "user",
  };
  users.push(user);
  return user;
};
User.findById = (id) => ({
  select: async () => {
    const user = users.find((u) => u._id === String(id));
    if (!user) return null;
    const { password, ...withoutPassword } = user;
    return withoutPassword;
  },
});
User.findOneAndUpdate = async (query, update) => {
  const user = users.find((u) => u.email === query.email);
  if (!user) return null;
  Object.assign(user, update);
  return user;
};

Product.find = async () => products;
Product.create = async (payload) => {
  const product = { _id: String(products.length + 1), ...payload };
  products.push(product);
  return product;
};
Product.findByIdAndUpdate = async (id, payload) => {
  const product = products.find((p) => p._id === String(id));
  if (!product) return null;
  Object.assign(product, payload);
  return product;
};
Product.findById = async (id) => products.find((p) => p._id === String(id)) || null;
Product.findByIdAndDelete = async (id) => {
  const index = products.findIndex((p) => p._id === String(id));
  if (index === -1) return null;
  const [deleted] = products.splice(index, 1);
  return deleted;
};

let server;
test.before(() => {
  server = app.listen(0);
});

test.after(() => {
  server.close();
});

test.beforeEach(async () => {
  resetData();
});

test("register endpoint creates user and returns token", async () => {
  const response = await jsonRequest(server, "POST", "/api/auth/register", {
    name: "User",
    email: "user@example.com",
    password: "password123",
  });

  assert.equal(response.status, 201);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, "user@example.com");
  assert.equal(users.length, 1);
});

test("register rejects duplicate emails", async () => {
  users.push({ _id: "1", name: "Existing", email: "existing@example.com", password: "x", role: "user" });

  const response = await jsonRequest(server, "POST", "/api/auth/register", {
    name: "Existing",
    email: "existing@example.com",
    password: "password123",
  });

  assert.equal(response.status, 409);
});

test("login endpoint validates credentials", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Login", email: "login@example.com", password: hashed, role: "user" });

  const response = await jsonRequest(server, "POST", "/api/auth/login", {
    email: "login@example.com",
    password: "password123",
  });

  assert.equal(response.status, 200);
  assert.ok(response.body.token);
});

test("me endpoint returns current user", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Me", email: "me@example.com", password: hashed, role: "user" });
  const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const response = await jsonRequest(server, "GET", "/api/auth/me", null, token);

  assert.equal(response.status, 200);
  assert.equal(response.body.user.email, "me@example.com");
});



test("OPTIONS /api/products returns CORS preflight headers for local dev origin", async () => {
  const response = await jsonRequest(server, "OPTIONS", "/api/products", null, null, {
    Origin: "http://localhost:5173",
    "Access-Control-Request-Method": "GET",
  });

  assert.match(String(response.status), /200|204/);
  assert.equal(response.headers["access-control-allow-origin"], "http://localhost:5173");
});

test("products list endpoint returns product array", async () => {
  products.push({ _id: "1", name: "Keyboard" });

  const response = await jsonRequest(server, "GET", "/api/products");

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 1);
});

test("product create requires auth", async () => {
  const response = await jsonRequest(server, "POST", "/api/products", {
    name: "Headphones",
    description: "wireless headphones with noise cancellation",
    price: 99,
    quantity: 2,
    category: "Electronics",
    images: ["https://example.com/1.jpg"],
  });

  assert.equal(response.status, 401);
});

test("admin can create and update a product", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Admin", email: "admin@example.com", password: hashed, role: "admin" });
  const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const created = await jsonRequest(
    server,
    "POST",
    "/api/products",
    {
      name: "Mouse",
      description: "ergonomic wireless mouse for daily work",
      price: 20,
      quantity: 10,
      category: "Electronics",
      images: ["https://example.com/mouse.jpg"],
    },
    token
  );

  assert.equal(created.status, 201);

  const updated = await jsonRequest(
    server,
    "PUT",
    `/api/products/${created.body._id}`,
    {
      name: "Mouse",
      description: "ergonomic wireless mouse for daily work",
      price: 25,
      quantity: 10,
      category: "Electronics",
      images: ["https://example.com/mouse.jpg"],
    },
    token
  );

  assert.equal(updated.status, 200);
  assert.equal(updated.body.price, 25);
});

test("admin can delete a product", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Admin", email: "admin@example.com", password: hashed, role: "admin" });
  products.push({ _id: "1", name: "To delete" });
  const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const response = await jsonRequest(server, "DELETE", "/api/products/1", null, token);

  assert.equal(response.status, 200);
  assert.match(response.body.message, /deleted/i);
});



test("add review requires auth", async () => {
  products.push({
    _id: "1",
    name: "Monitor",
    reviews: [],
    numReviews: 0,
    ratings: 0,
  });

  const response = await jsonRequest(server, "POST", "/api/products/1/reviews", {
    rating: 5,
    comment: "Great monitor",
  });

  assert.equal(response.status, 401);
});

test("successful review updates numReviews and ratings", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Reviewer", email: "reviewer@example.com", password: hashed, role: "user" });
  products.push({
    _id: "1",
    name: "Laptop",
    reviews: [],
    numReviews: 0,
    ratings: 0,
  });
  const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const response = await jsonRequest(
    server,
    "POST",
    "/api/products/1/reviews",
    { rating: 4, comment: "Solid and reliable laptop" },
    token
  );

  assert.equal(response.status, 201);
  assert.equal(products[0].numReviews, 1);
  assert.equal(products[0].ratings, 4);
  assert.equal(products[0].reviews.length, 1);
  assert.equal(products[0].reviews[0].name, "Reviewer");
});

test("duplicate review is blocked", async () => {
  const hashed = await bcrypt.hash("password123", 10);
  users.push({ _id: "1", name: "Reviewer", email: "reviewer@example.com", password: hashed, role: "user" });
  products.push({
    _id: "1",
    name: "Laptop",
    reviews: [
      {
        user: "1",
        name: "Reviewer",
        rating: 5,
        comment: "Excellent",
        createdAt: new Date().toISOString(),
      },
    ],
    numReviews: 1,
    ratings: 5,
  });
  const token = jwt.sign({ id: "1" }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const response = await jsonRequest(
    server,
    "POST",
    "/api/products/1/reviews",
    { rating: 4, comment: "Updating review" },
    token
  );

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "You have already reviewed this product");
});
test("unknown API route returns JSON 404 response", async () => {
  const response = await jsonRequest(server, "GET", "/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Not found");
  assert.match(response.headers["content-type"], /application\/json/);
});

test("GET /api/users/login is not handled by SPA fallback", async () => {
  const response = await jsonRequest(server, "GET", "/api/users/login");

  assert.equal(response.status, 404);
  assert.equal(response.body.message, "Not found");
  assert.match(response.headers["content-type"], /application\/json/);
});
