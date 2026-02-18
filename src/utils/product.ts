import  axios  from 'axios';


export const fetchProduct = async () => {
    try {
        const products = axios.get('https://fakestoreapi.com/products');
        return products;
    } catch (error) {
       console.log(error);
        return error;
    }
}
