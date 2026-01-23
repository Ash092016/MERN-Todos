const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const Schema=mongoose.Schema

//Defining the User Schema 
const UserSchema=new Schema(
    {
        name:{
            type:String,
            required:[true,'Please add a name'],
            trim:true,
        },
        email:{
            type:String,
            required:[true,'Please add an email'],
            unique:true,
            lowercase:true,
            trim:true,
            match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Please add a valid email address',],
        },
        password:{
            type:String,
            required:[true,'Please add a password'],
            minlength:6,
            select:false,
        },
    },
    {
        timestamps:true,
    }
)

//Hashing the password before saving new user into the database
UserSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next();
})

UserSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

module.exports=mongoose.model('User',UserSchema)