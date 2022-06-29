import { products } from "./constants/data.js"
import { Product } from "./model/productSchema.js"



export const defaultData=async()=>{
    try {
      await Product.insertMany(products)
      console.log('data imported ');
    } catch (error) {
     console.log('error while import data',error.message);   
    }
}