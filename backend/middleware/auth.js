const jwt=require('jsonwebtoken')
const User=require('../models/User')

//Authentication Middleware which protects the routes by verifying JWT tokens
const protect=async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        try{
            token=req.headers.authorization.split(' ')[1]
            const decoded=jwt.verify(token,process.env.JWT_SECRET)

            //gets the user from the database , excluding the password field
            req.user=await User.findById(decoded.id).select('-password')

            if(!req.user){
                res.status(401)
                throw new Error('User not found')
            }
            next()
            return 
        }
        catch(error){
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }
    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
}

module.exports={protect}