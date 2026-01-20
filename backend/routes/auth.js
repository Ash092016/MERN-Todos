const express=require('express')
const router=express.Router()
const jwt=require('jsonwebtoken')
const User=require('../models/User')

//generating the JWT Token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}

//signup endpoint
router.post('/signup',async (req,res,next)=>{
    try{
        const {name,email,password}=req.body

        //Validating the data from frontend
        if(!name || !email || !password){
            res.status(400)
            throw new Error('Please provide all fields')
        }

        if(password.length<6){
            res.status(400)
            throw new Error('Password must be atleast 6 characters')
        }

        //Check if user exists in database
        const UserExists=await User.findOne({email})
        if(UserExists){
            res.status(400)
            throw new Error('User already exists')
        }

        const user=await User.create({
            name:name,
            email:email,
            password:password
        })

        if(user){
            return res.status(201).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token:generateToken(user._id),
            })
        }
    }
    catch(error){
        next(error)
    }
})

//login endpoint
router.post('/login',async (req,res,next)=>{
    try{
        const {email,password}=req.body

        if(!email || !password){
            res.status(400)
            throw new Error('Please provide all fields')
        }

        //Finding user by email
        const user=await User.findOne({email})

        //Validating whether user exists and matching the password
        if(user && (await user.matchPassword(password))){
            res.json({
                 _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            })
        }
        else{
            res.status(401)
            throw new Error('Invalid email or password')
        }
    }
    catch(error){
        next(error)
    }
})

module.exports=router