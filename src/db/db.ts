import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


 export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

pool.on("connect", ()=> {
     console.log("connected to the database");
})

pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});