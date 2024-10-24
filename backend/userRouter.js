const express = require("express")
const app = express();
const {User} = require("./db")
const {z} = require("zod")
const router = express.Router();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
app.use(express.json());
const JWT_SECRET = "Abhishek"

const signupSchema = z.object({
    username:z.string().min(5),
    email:z.string().email(),
    password:z.string().min(6)
})

router.post("/signup", async(req,res)=>{
    const validatedData = signupSchema.parse(req.body)
    const {username, email, password} = validatedData;

    const hashedPassword =await bcrypt.hash(password, 5)
    try {
        const newUser = await User.create({
            username, 
            email,
            password:hashedPassword
        })
        res.json({
            message:"user created successfully" 
        })
    } catch (error) {
        res.json({
            message:"Failed to create user"
        })
    }
})


router.post("/signin", async(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    
    try {
        const user =await User.findOne({
            email
        })
        const isPasswordValid =await bcrypt.compare(password, user.password)

        if(user && isPasswordValid){
            const token = jwt.sign({
                email
            }, JWT_SECRET)
        res.json({
            message:token
        })
        }
    } catch (error) {
        res.json({
            message:"Error in signing"
        })
    }
})



module.exports = router