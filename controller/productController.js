import { STATUSES } from "../constants/status.js";
import { Product } from "../model/productSchema.js";

//getting all product
export const getAllProduct = async (req, resp) => {
  try {
    const data = await Product.find();
    console.log('data',data);
    resp.status(200).json({ status: STATUSES.SUCCESS, data: data });
  } catch (error) {
    console.error("error while fetching product", error.message);
    resp.status(500).json({ "status": STATUSES.FAILED, "message":error.message});

  }
};
