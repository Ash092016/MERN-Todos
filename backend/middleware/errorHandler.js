//Error Handler middleware which catches and formats the error from all routes 

const errorHandler=(err,req,res,next)=>{
    let statusCode=res.statusCode===200?res.statusCode:500
    let message=err.message

    if(err.name==='ValidationError'){
        statusCode=400
        message=Object.values(err.errors).map(val => val.message).join(', ')
    }

    if(err.name==='CastError' && err.kind==='ObjectId'){
        statusCode=404
        message='Resource not found'
    }

    if(err.name === 'JsonWebTokenError') {
        statusCode=401
        message='Invalid token, please login again'
    }

    if(err.name === 'TokenExpiredError') {
        statusCode=401
        message='Token expired, please login again'
    }

    res.status(statusCode).json({
        success:false,
        message,
        stack:process.env.NODE_ENV==='production'?null:err.stack
    })
}
module.exports={errorHandler}