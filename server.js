
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const orders = new Map();

// صفحات الموقع
app.use("/customer", express.static(path.join(__dirname, "customer")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/", (req, res) => {
  res.redirect("/customer/");
});

// فحص عمل الخادم
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "Ela Tiramisu" });
});

// استقبال طلب جديد
app.post("/orders", (req, res) => {
  const { client, phone, notes, items } = req.body || {};

  if (
    !client ||
    !phone ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      error: "يرجى إدخال اسم العميل والهاتف والأصناف"
    });
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

  res.status(201).json({
    ok: true,
    id,
    message: "تم استلام الطلب"
  });
});

// عرض جميع الطلبات للإدارة
app.get("/orders", (req, res) => {
  const allOrders = [...orders.values()].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  res.json(allOrders);
});

// تعديل الأسعار والدفع وحالة الطلب
app.patch("/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);

  if (!order) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  const { payment, status, prices } = req.body || {};

  if (payment !== undefined) order.payment = payment;
  if (status !== undefined) order.status = status;
  if (prices !== undefined) order.prices = prices;

  res.json({ ok: true, order });
});

app.listen(PORT, () => {
  console.log("Ela Tiramisu server running on port " + PORT);
});
