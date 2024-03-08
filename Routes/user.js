import express from "express"
import { User, generatejwtToken } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../Controller/auth.js";



const router = express.Router();


router.post("/signup", async(req,res)=>{
    try {
        //find user
        let user = await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).json({message:"user already exits..!"})
        }
        //generate hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //update the password

        user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
            contact:req.body.contact
        }).save()

        //generate jwtToken

        const token = await generatejwtToken(user._id)
        return res. status(200).json({message:"Sucessfully login", token})


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

// for login

router.post("/login", async(req, res)=>{
    try {
        //find user
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).json({message:"Invalid user.."})
        }
        //is valid password
        const password = await bcrypt.compare(req.body.password, user.password)
        if(!password){
            return res.status(400).json({message:"Invalid passwod..."})
        }
        //generate token
        const token = await generatejwtToken(user._id)
        return res.status(200).json({message:"Logged in Sucessfully...", token})
    } catch (error) {
        console.Console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//for logout
router.get("/logout", async(req, res)=>{
    try {
        let token = await req.headers["x-auth-token"]
        token = undefined;
        return res.status(200).json({message:"Logged out sucessfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})
//forgot password
router.post("/forgotpassword",async(req,res)=>{
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ Err: "please enter valid email" });

        }
        const matchedUser = await User.findOne({ email });
        if (!matchedUser) {
            return res.status(400).json({ Err: "user not found exists" });

        }
        const randomString =
            Math.random().toString(16).substring(2, 15) +
            Math.random().toString(16).substring(2, 15);

            matchedUser.token_reset_pssword = randomString

            await User.findByIdAndUpdate(matchedUser.id, matchedUser)
            //send mail for resetting
            const resetUrl = `${req.protocol}://${req.get('host')}/bike/reset-new-password/${randomString}`;
        //  console.log(resetUrl);
 
         const msg = `This one is reset url  ${resetUrl}`
         await sendEmail({
             email: User.email,
             subject: 'Reset link for verifiction of forgot password',
             msg: msg
 
         })
         return res.status(200).json({ data: "Mail send sucessfully",msg})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

// update password
router.post("/reset-new-password/:token", async (req, res) => {
    try {
        const resetUrl = req.params.id;
        const { password } = req.body;
        const matchedUser = await User.findOne({ token_reset_password: resetUrl });
        if (matchedUser === null || matchedUser.token_reset_password === "") {
            return res
                .status(400)
                .json({ Err: "user not exists or reset link expired" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        matchedUser.password = hashedPassword;
        matchedUser.token_reset_password = `Password Updated on ${new Date()}`;


        await User.findByIdAndUpdate(matchedUser.id, matchedUser);
        return res.status(200).json({
            message: `${matchedUser.username} password has beed changed sucessfully`,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal sever error"})
    }
})



export const userRouter = router;