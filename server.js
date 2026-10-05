const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const app = express();
app.use(cors());
app.use(express.json());

const orders = new Map();

app.get("/health",(req,res)=>res.json({ok:true,service:"Ela Tiramisu"}));

app.post("/orders",(req,res)=>{
  const {client,phone,notes,items}=req.body||{};
  if(!client || !phone || !Array.isArray(items) || !items.length)
    return res.status(400).json({error:"invalid order"});
  const id=crypto.randomBytes(3).toString("hex").toUpperCase();
  const order={id,client,phone,notes:notes||"",items,payment:"unpaid",prices:{},status:"new",createdAt:new Date().toISOString()};
  orders.set(id,order);
  res.status(201).json({id});
});

app.get("/orders",(req,res)=>{
  res.json([...orders.values()].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)));
});

app.patch("/orders/:id",(req,res)=>{
  const o=orders.get(req.params.id);
  if(!o)return res.status(404).json({error:"not found"});
  const {payment,status,prices}=req.body||{};
  if(payment) o.payment=payment;
  if(status) o.status=status;
  if(prices) o.prices=prices;
  res.json(o);
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log("Ela Tiramisu API running on "+port));
