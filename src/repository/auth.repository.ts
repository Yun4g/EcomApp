import { pool } from "../db/db";


export const checkExistingUserRepo = async (email: string) => {
        try {
            const  ExistingUserRepo = await pool.query("SELECT * FROM users WHERE email = $1 ", [email]);
            return ExistingUserRepo.rows[0];
        } catch (error) {
            console.log(error);
        }
}

export const DebugQuery = async () => {
        try {
            const  ExistingUserRepo = await pool.query("SELECT * FROM users ");
            return ExistingUserRepo.rows[0];
        } catch (error) {
            console.log(error);
        }
}


export const checkGoogleExistingUserRepo = async (email: string, googleId: string) => {
        try {
            const  ExistingUserRepo = await pool.query("SELECT * FROM users WHERE email = $1 OR google_id = $2 ", [email, googleId]);
            return ExistingUserRepo.rows[0];
        } catch (error) {
            console.log(error);
        }
}


export const findUserById = async (id: string) => {

        try {
            const  ExistingUserRepo = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
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

export const UpdateUserPasswordRepo = async (  email: string, newPassword: string) => {
     try {
         const UpdateUserPassword = await pool.query("UPDATE users SET password = $1 WHERE email = $2 RETURNING *", [newPassword, email])
         return UpdateUserPassword.rows[0];
     } catch (error) {
        console.log(error);
     }
}
export const  GoogleCreateUserRepo = async (name: string, email: string, googleId: string) => {
     try {
         const CreateUser = await pool.query("INSERT INTO users (name, email, google_id) VALUES ($1,$2, $3) RETURNING *"
            , [name, email, googleId]
         )
         return CreateUser.rows[0];
     } catch (error) {
        console.log(error);
          throw error;
     }
}