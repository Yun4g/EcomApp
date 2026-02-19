import axios from 'axios';
import { InsertProduct } from '../repository/product.repositroy';


export const fetchProduct = async () => {
    try {
        const products = await axios.get('https://fakestoreapi.com/products');
        for (const product of products.data) {
            await InsertProduct(product);
        }

        console.log("Products inserted successfully");
        return products;
    } catch (error) {
        console.log(error);
        return error;
    }
}

