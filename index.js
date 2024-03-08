import express from "express";
import { dbConnection } from "./db.js";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./Routes/user.js";
import { productRouter } from "./Routes/product.js";
import { isAuthenticted } from "./Controller/auth.js";





//config the env
dotenv.config()
const PORT = process.env.PORT

const app = express();


//middleware
app.use(express.json());
app.use(cors());

//db connection 
dbConnection()

//routes
app.use("/bike", userRouter)
app.use("/bike",isAuthenticted, productRouter)


//server listner
app.listen(PORT, ()=>console.log("server runnig in localhost", `${PORT}`))