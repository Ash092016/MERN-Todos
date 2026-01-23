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

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
          res.status(400)
          throw new Error('Invalid email format')
        }
        
        if(password.length<6){
            res.status(400)
            throw new Error('Password must be at least 6 characters')
        }

        //Check if user exists in database
        const UserExists=await User.findOne({email:email.toLowerCase()})
        if(UserExists){
            res.status(400)
            throw new Error('User already exists')
        }

        const user=await User.create({
            name:name,
            email:email.toLowerCase(),
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
        else{
            res.status(500)
            throw new Error('Failed to create user')
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
        const user=await User.findOne({email:email.toLowerCase()}).select('+password')

        //Validating whether user exists and matching the password
        if(user && (await user.matchPassword(password))){
            return res.status(200).json({
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