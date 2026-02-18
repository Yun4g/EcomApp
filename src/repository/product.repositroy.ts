import { pool } from "../db/db";
import { ProductType } from "../types/product";
import { fetchProduct } from "../utils/product";





  export const InsertProduct = async () => {
        try {
             const product: ProductType = await fetchProduct();
             console.log(product);
            
             const InsertProduct = await pool.query('INSERT INTO products (product_name, price, description, category,  image_url, rating) VALUES($1, $2, $3, $4, $5)'[product.title, product.price, product.description, product.image, product.rating])
        } catch (error) {
            return console.log(error);
        
        }
  }


