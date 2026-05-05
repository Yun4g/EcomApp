import axios from 'axios';
import { GetProduct, InsertProduct } from '../repository/product.repositroy';


export const fetchProduct = async () => {
    const GetProducts = await GetProduct();
    if (GetProducts && GetProducts.length > 0) {
        console.log("Products already exist");
        return;
    }
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

