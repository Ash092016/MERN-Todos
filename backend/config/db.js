const mongoose=require('mongoose')

const connectDB=async ()=>{
    try{
        const con=await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected : ${con.connection.name}`)
    }
    catch(error){
        console.error(`Error : ${error.message}`)
        process.exit(1)
    }
}

module.exports=connectDB