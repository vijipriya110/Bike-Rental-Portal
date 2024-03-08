import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema
const productSchema = new mongoose.Schema({

    brandname: {
        type: String,
        required: true,
      },
      model: {
        type: String,
        required: true,
      },
      condition: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      Image: {
        type: String,
        required: true,
      },
      user:{
        type:{ObjectId},
        ref:"user"
    }
    
})

const Product = mongoose.model("product",productSchema)

export {Product}