import { pool } from "../db/db";


export const checkExistingUserRepo = async (email: string) => {

        try {
            const  ExistingUserRepo = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            
            return ExistingUserRepo.rows[0];
        } catch (error) {
            console.log(error);
        }
}


export const createUserRepo = async (name: string, email: string, password: string) => {
      try {
         const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
         return newUser.rows[0];
      } catch (error) {
         console.log(error);
        
      }
}