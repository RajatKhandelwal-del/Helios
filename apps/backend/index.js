import express from 'express'
import {createServer} from "node:http";
import mongoose from 'mongoose';
import cors from "cors"
import { port } from '../../packages/config/index.js';
import userRoutes from "./routes/user.routes.js"

const app=express()

const MONGO_URL="mongodb+srv://rajatkhandelwal2310_db_user:5SQbe5ltKC3Luw8K@helios.jbq7vcm.mongodb.net/?appName=Helios"

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(cors());
const server=createServer(app);
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb"}));

app.use("/api/users", userRoutes);

app.get("/home",(req,res)=>{
    return res.json({"hello":"world"})
})

server.listen(port, () => {
  console.log("Listning to 3000");
});