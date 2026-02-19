import { pool } from "../db/db";
import { ProductType } from "../types/product";






  export const InsertProduct = async (product: ProductType) => {
        try {
             const InsertProduct = await pool.query('INSERT INTO products (product_name, price, description, category,  image_url, rating) VALUES($1, $2, $3, $4, $5) RETURNING*',
                [product.title, product.price, product.description, product.image, product.rating])
           return InsertProduct.rows[0];
            } catch (error) {
            return console.log(error);
        
        }
  }

 