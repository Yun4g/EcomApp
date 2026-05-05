import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 3,
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected at:", res.rows[0].now);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();

pool.on("connect", ()=> {
     console.log("connected to the database  successfully");
})

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});