// const mongoose = require("mongoose");

// const connectDB = async ()=>{
//     try {
//     await mongoose.connect(process.env.MONGO_URI);
//         console.log("MongoDB Connected 🚀"); 
//     } catch (error) {
//       console.log("Dtabase Error:",error);
//       process.exit(1);  
//     }
// }
// module.exports=connectDB;
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err)=>{
    if(err){
        console.log("Connection error:",err);
    }
    else{
        console.log("MySql Connected Successfully");
    }
});

export default db;