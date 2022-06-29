import express from 'express';
import { getAllProduct } from '../controller/productController.js';

const router=express.Router();






//get all product
router.get('/allproduct',getAllProduct);



export default router;