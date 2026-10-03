import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pg from "pg";
import {products as seedProducts} from "./data.js";
dotenv.config();
const {Pool}=pg;
const app=express(),PORT=process.env.PORT||5000,JWT_SECRET=process.env.JWT_SECRET||"quickcart-demo-secret";
app.use(cors({origin:"*",methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"]}));
app.use(express.json());
let pool=process.env.DATABASE_URL?new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}}):null;
const memoryUsers=[{id:1,name:"QuickCart Admin",email:"admin@quickcart.local",password:bcrypt.hashSync("QuickCart@123",10),role:"admin"}],memoryCarts=new Map(),memoryOrders=[];
let dbReady=false;
async function initDb(){
 if(!pool)return;
 await pool.query(`CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'customer',created_at TIMESTAMPTZ DEFAULT now());
 CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY,name TEXT NOT NULL,category TEXT NOT NULL,price INTEGER NOT NULL,icon TEXT NOT NULL,stock INTEGER NOT NULL DEFAULT 20);
 CREATE TABLE IF NOT EXISTS carts(user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,qty INTEGER NOT NULL CHECK(qty>0),PRIMARY KEY(user_id,product_id));
 CREATE TABLE IF NOT EXISTS orders(id SERIAL PRIMARY KEY,user_id INTEGER REFERENCES users(id),subtotal INTEGER NOT NULL,delivery INTEGER NOT NULL,handling INTEGER NOT NULL,total INTEGER NOT NULL,status TEXT NOT NULL DEFAULT 'Confirmed',address JSONB NOT NULL,payment_method TEXT NOT NULL DEFAULT 'COD',created_at TIMESTAMPTZ DEFAULT now());
 CREATE TABLE IF NOT EXISTS order_items(id SERIAL PRIMARY KEY,order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,product_id INTEGER REFERENCES products(id),name TEXT NOT NULL,price INTEGER NOT NULL,qty INTEGER NOT NULL,line_total INTEGER NOT NULL)`);
 const count=await pool.query("SELECT COUNT(*)::int n FROM products"); if(!count.rows[0].n)for(const p of seedProducts)await pool.query("INSERT INTO products(id,name,category,price,icon,stock) VALUES($1,$2,$3,$4,$5,$6)",[p.id,p.name,p.category,p.price,p.icon,p.stock]);
 const admin=await pool.query("SELECT id FROM users WHERE email=$1",["admin@quickcart.local"]);
 if(!admin.rowCount)await pool.query("INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'admin')",["QuickCart Admin","admin@quickcart.local",await bcrypt.hash("QuickCart@123",10)]);
 dbReady=true;
}
const tokenFor=u=>jwt.sign({id:u.id,email:u.email,name:u.name,role:u.role},JWT_SECRET,{expiresIn:"7d"});
async function sendOrderSms(phone,order){
  const key=process.env.FAST2SMS_API_KEY;
  if(!key) return {sent:false,reason:"not_configured"};
  const number=String(phone||"").replace(/\D/g,"");
  if(number.length!==10) return {sent:false,reason:"invalid_phone"};
  const message=`QuickCart: Order #${order.id} confirmed. Total ₹${order.total}. Payment: COD. Thank you for shopping!`;
  try{
    const r=await fetch("https://www.fast2sms.com/dev/bulkV2",{
      method:"POST",
      headers:{"authorization":key,"content-type":"application/json"},
      body:JSON.stringify({route:"q",message,numbers:number,sms_details:"1"})
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok || data.return===false) return {sent:false,reason:"provider_error"};
    return {sent:true};
  }catch{return {sent:false,reason:"provider_unreachable"}}
}
const auth=async(req,res,next)=>{try{const h=req.headers.authorization||"";if(!h.startsWith("Bearer "))return res.status(401).json({message:"Login required"});req.user=jwt.verify(h.slice(7),JWT_SECRET);next()}catch{return res.status(401).json({message:"Invalid or expired token"})}};
const userByEmail=async email=>pool?(await pool.query("SELECT * FROM users WHERE email=$1",[email.toLowerCase()])).rows[0]:memoryUsers.find(u=>u.email===email.toLowerCase());
async function productsList(){return pool?(await pool.query("SELECT id,name,category,price,icon,stock FROM products ORDER BY id")).rows:seedProducts}
app.get("/api/health",async(req,res)=>res.json({ok:true,service:"QuickCart API",database:!!pool&&dbReady,time:new Date().toISOString()}));
app.get("/api/products",async(req,res)=>{try{let out=await productsList();const{q,category,sort}=req.query;if(q)out=out.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));if(category&&category!=="All")out=out.filter(p=>p.category===category);if(sort==="price-low")out.sort((a,b)=>a.price-b.price);if(sort==="price-high")out.sort((a,b)=>b.price-a.price);res.json(out)}catch(e){res.status(503).json({message:"Products service temporarily unavailable"})}});
app.get("/api/categories",async(req,res)=>{try{const p=await productsList();res.json(["All",...new Set(p.map(x=>x.category))])}catch(e){res.status(503).json({message:"Categories service temporarily unavailable"})}});
app.post("/api/auth/register",async(req,res)=>{try{const{name,email,password}=req.body||{};if(!name||!email||!password||password.length<6)return res.status(400).json({message:"Name, email and password (6+ chars) are required"});if(await userByEmail(email))return res.status(409).json({message:"Email already registered"});const u=pool?(await pool.query("INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,'customer') RETURNING *",[name,email.toLowerCase(),await bcrypt.hash(password,10)])).rows[0]:{id:memoryUsers.length+1,name,email:email.toLowerCase(),password:await bcrypt.hash(password,10),role:"customer"};if(!pool)memoryUsers.push(u);res.json({token:tokenFor(u),user:{id:u.id,name:u.name,email:u.email,role:u.role}})}catch(e){res.status(503).json({message:"Login service temporarily unavailable"})}});
app.post("/api/auth/login",async(req,res)=>{try{const{email,password}=req.body||{},u=await userByEmail(String(email||""));if(!u||!(await bcrypt.compare(password||"",u.password)))return res.status(401).json({message:"Invalid email or password"});res.json({token:tokenFor(u),user:{id:u.id,name:u.name,email:u.email,role:u.role}})}catch(e){res.status(503).json({message:"Login service temporarily unavailable"})}});
app.get("/api/me",auth,(req,res)=>res.json(req.user));
app.get("/api/cart",auth,async(req,res)=>res.json(await cartFor(req.user.id)));
async function cartFor(uid){if(pool){return (await pool.query(`SELECT p.id,p.name,p.category,p.price,p.icon,p.stock,c.qty,p.price*c.qty AS "lineTotal" FROM carts c JOIN products p ON p.id=c.product_id WHERE c.user_id=$1 ORDER BY p.id`,[uid])).rows}const ids=memoryCarts.get(uid)||{};return Object.entries(ids).map(([id,qty])=>{const p=seedProducts.find(x=>x.id===+id);return p?{...p,qty:+qty,lineTotal:p.price*qty}:null}).filter(Boolean)}
app.put("/api/cart/:productId",auth,async(req,res)=>{const id=+req.params.productId,qty=Math.max(0,Math.min(20,Number(req.body.qty)||0));if(pool){const p=(await pool.query("SELECT * FROM products WHERE id=$1",[id])).rows[0];if(!p)return res.status(404).json({message:"Product not found"});if(qty>p.stock)return res.status(400).json({message:"Only "+p.stock+" available"});if(qty)await pool.query("INSERT INTO carts(user_id,product_id,qty) VALUES($1,$2,$3) ON CONFLICT(user_id,product_id) DO UPDATE SET qty=EXCLUDED.qty",[req.user.id,id,qty]);else await pool.query("DELETE FROM carts WHERE user_id=$1 AND product_id=$2",[req.user.id,id]);return res.json(await cartFor(req.user.id))}const p=seedProducts.find(x=>x.id===id);if(!p)return res.status(404).json({message:"Product not found"});const c=memoryCarts.get(req.user.id)||{};if(qty)c[id]=qty;else delete c[id];memoryCarts.set(req.user.id,c);res.json(await cartFor(req.user.id))});
app.delete("/api/cart",auth,async(req,res)=>{if(pool)await pool.query("DELETE FROM carts WHERE user_id=$1",[req.user.id]);else memoryCarts.delete(req.user.id);res.json([])});
app.post("/api/orders",auth,async(req,res)=>{const items=await cartFor(req.user.id);if(!items.length)return res.status(400).json({message:"Cart is empty"});const subtotal=items.reduce((s,x)=>s+x.lineTotal,0),delivery=subtotal>=499?0:35,handling=subtotal?4:0;if(pool){const client=await pool.connect();try{await client.query("BEGIN");for(const x of items){const r=await client.query("UPDATE products SET stock=stock-$1 WHERE id=$2 AND stock >= $1 RETURNING id",[x.qty,x.id]);if(!r.rowCount)throw Error(x.name+" is out of stock")}const o=(await client.query("INSERT INTO orders(user_id,subtotal,delivery,handling,total,address,payment_method) VALUES($1,$2,$3,$4,$5,$6,'COD') RETURNING *",[req.user.id,subtotal,delivery,handling,subtotal+delivery+handling,JSON.stringify(req.body.address||{})])).rows[0];for(const x of items)await client.query("INSERT INTO order_items(order_id,product_id,name,price,qty,line_total) VALUES($1,$2,$3,$4,$5,$6)",[o.id,x.id,x.name,x.price,x.qty,x.lineTotal]);await client.query("DELETE FROM carts WHERE user_id=$1",[req.user.id]);await client.query("COMMIT");const sms=await sendOrderSms(o.address?.phone,{id:o.id,total:o.total});
return res.status(201).json({...o,id:o.id,items,sms})}catch(e){await client.query("ROLLBACK");return res.status(400).json({message:e.message})}finally{client.release()}}for(const x of items){const p=seedProducts.find(p=>p.id===x.id);if(x.qty>p.stock)return res.status(400).json({message:p.name+" is out of stock"});p.stock-=x.qty}const o={id:1000+memoryOrders.length+1,userId:req.user.id,items,subtotal,delivery,handling,total:subtotal+delivery+handling,status:"Confirmed",address:req.body.address||{},paymentMethod:"COD",createdAt:new Date().toISOString()};memoryOrders.push(o);memoryCarts.delete(req.user.id);const sms=await sendOrderSms(o.address.phone,o);res.status(201).json({...o,sms})});
app.get("/api/orders",auth,async(req,res)=>{if(pool){const os=(await pool.query("SELECT * FROM orders WHERE user_id=$1 ORDER BY created_at DESC",[req.user.id])).rows;for(const o of os){o.createdAt=o.created_at;o.paymentMethod=o.payment_method;o.items=(await pool.query("SELECT product_id AS id,name,price,qty,line_total AS \"lineTotal\" FROM order_items WHERE order_id=$1 ORDER BY id",[o.id])).rows}return res.json(os)}res.json(memoryOrders.filter(o=>o.userId===req.user.id).sort((a,b)=>b.id-a.id))});
app.get("/api/admin/stats",auth,async(req,res)=>{if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});if(pool){const [p,u,o,r]=await Promise.all([pool.query("SELECT COUNT(*)::int n FROM products"),pool.query("SELECT COUNT(*)::int n FROM users"),pool.query("SELECT COUNT(*)::int n FROM orders"),pool.query("SELECT COALESCE(SUM(total),0)::int n FROM orders WHERE status <> 'Cancelled'")]);return res.json({products:p.rows[0].n,users:u.rows[0].n,orders:o.rows[0].n,revenue:r.rows[0].n})}res.json({products:seedProducts.length,users:memoryUsers.length,orders:memoryOrders.length,revenue:memoryOrders.reduce((s,o)=>s+o.total,0)})});
app.get("/api/admin/orders",auth,async(req,res)=>{if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});if(pool){const rows=(await pool.query("SELECT o.*,u.name AS customer_name,u.email AS customer_email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC")).rows;return res.json(rows.map(o=>({...o,createdAt:o.created_at,paymentMethod:o.payment_method}))) }res.json(memoryOrders)});
app.patch("/api/admin/orders/:id",auth,async(req,res)=>{if(req.user.role!=="admin")return res.status(403).json({message:"Admin only"});const allowed=["Confirmed","Packed","Out for delivery","Delivered","Cancelled"];if(!allowed.includes(req.body.status))return res.status(400).json({message:"Invalid status"});if(pool){const r=await pool.query("UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",[req.body.status,+req.params.id]);if(!r.rowCount)return res.status(404).json({message:"Order not found"});return res.json({...r.rows[0],createdAt:r.rows[0].created_at,paymentMethod:r.rows[0].payment_method})}const o=memoryOrders.find(x=>x.id===+req.params.id);if(!o)return res.status(404).json({message:"Order not found"});o.status=req.body.status;res.json(o)});
initDb().then(()=>app.listen(PORT,()=>console.log("QuickCart API running on "+PORT+" | PostgreSQL "+(pool&&dbReady?"connected":"fallback")))).catch(e=>{console.error("Database initialization failed:",e);pool=null;dbReady=false;app.listen(PORT,()=>console.log("QuickCart API running on "+PORT+" | memory fallback"))});
