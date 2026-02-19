import { pool } from "../db/db";
import { ProductType } from "../types/product";






  export const InsertProduct = async (product: ProductType) => {
    if (!product) return;
        try {
             const InsertProduct = await pool.query('INSERT INTO products (product_name, price, description, category,  image_url, rating) VALUES($1, $2, $3, $4, $5, $6) RETURNING*',
                [product.title, product.price, product.description, product.category, product.image, product.rating.rate, ])
           return InsertProduct.rows[0];
            } catch (error) {
                  console.error("Insert error:", error);
                throw error;
        }
  }

  export const GetProduct = async () => {
     try {
        const GetProduct = await pool.query('SELECT * FROM products');
        return GetProduct.rows;
     } catch (error) {
        console.error("Get error:", error);
        throw error;
     }
  }
 