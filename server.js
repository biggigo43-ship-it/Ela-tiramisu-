const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const orders = new Map();

app.use("/customer", express.static(path.join(__dirname, "customer")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/", (req, res) => {
  res.redirect("/customer/");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "Ela Tiramisu" });
});

app.post("/orders", (req, res) => {
  const { client, phone, notes, items } = req.body || {};

  if (!client || !phone || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "invalid order" });
  }

  const id = crypto.randomBytes(3).toString("hex").toUpperCase();

  const order = {
    id,
    client,
    phone,
    notes: notes || "",
    items,
    payment: "unpaid",
    prices: {},
    status: "new",
    createdAt: new Date().toISOString()
  };

  orders.set(id, order);

  res.status(201).json({ id });
});

app.get("/orders", (req, res) => {
  res.json(
    [...orders.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    )
  );
});

app.patch("/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);

  if (!order) {
    return res.status(404).json({ error: "not found" });
  }

  const { payment, status, prices } = req.body || {};

  if (payment) order.payment = payment;
  if (status) order.status = status;
  if (prices) order.prices = prices;

  res.json(order);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Ela Tiramisu running on port " + port);
});
