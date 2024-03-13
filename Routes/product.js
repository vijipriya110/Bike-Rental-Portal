import express from "express";
import { Product } from "../models/product.js";




const router = express.Router();

//to add new product
router.post("/add-product", async(req, res)=>{
    try {
        const { brandname, model, condition, price, quantity, Image} =
      req.body;

    //validation
    switch (true) {
      case !brandname:
        return res.status(500).send({ error: "Brandname is Required" });
      case !model:
        return res.status(500).send({ error: "Model is Required" });
      case !condition:
        return res.status(500).send({ error: "Condition is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case !Image:
        return res.status(500).send({ error: "Image is Required" });
    }
      const product = await new Product({
        ...req.body,
        user: req.user._id
      }).save()

      
    return res.status(200).json({message:"product save sucessfully", data:product})


    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//to get all product
router.get("/all-product", async(req,res)=>{
    try {
        const products = await Product.find()
        if(!products){
            return res.status(400).json({message:"Could not found any info"})
        }
        return res.status(200).json({message:"Sucessfuly got products data",products})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

//to get which user post the product
router.get("/user", async(req, res)=>{
    try {
        const products = await Product.find({user:req.user._id}).populate("user", "username");
        if(!products){
            return res.status(400).json({message:"Could not found any info"})
        }
        return res.status(200).json({message:"Sucessfuly got product owner details",products})


    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//get single product
router.get("/product/:id",async(req, res)=>{
    try {
        // const {id} = req.params;
        const product = await Product.findOne({_id:req.params.id})
        if(!product){
            return res.status(400).json({message:"Invalid product id..."})
        }
        return res.status(200).json({message:"Product got sucessfully", product})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//to edit the product details
router.put("/product/edit/:id", async(req, res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            {_id:req.params.id},
            { $set: req.body },
            { new: true }
            )

            if (!updatedProduct) {
                return res.status(400).json({ message: "Error Occured" })
            }
            res.status(200).json({ message: "Sucessfully updated", data: updatedProduct })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//delete product
router.delete("/product/delete/:id", async(req, res)=>{
    try {
        const deleteProduct = await Product.findByIdAndDelete({_id:req.params.id})

        if (!deleteProduct) {
            return res.status(400).json({ message: "Error Occured" })
        }
        res.status(200).json({ message: "Sucessfully deleted" })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//to count the product
router.get("/product-count", async(req, res)=>{
try {
    const total = await Product.find({}).estimatedDocumentCount();
    res.status(200).json({message:"Get Total count sucessfully", total})
} catch (error) {
    console.log(error)
    return res.status(500).json({message:"Internal server error"})

}
})

//to calculate the hours
router.post("/hours/:id", async(req,res)=>{
    try {
        const product = await Product.findOne({_id:req.params.id})
        const date1 = new Date(req.body.startTime)
        const date2 = new Date(req.body.endTime)
        const totalHours = (date2-date1)/(1000*3600)
         res.status(200).json({message:"Get Total hours sucessfully", totalHours})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})



export const productRouter = router