const mongoose=require('mongoose')

const Schema=mongoose.Schema

//Defining the Todos Schema, where each todo belongs to a specific user (referenced by UserID)
const TodoSchema=new Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User',
        },
        title:{
            type:String,
            required:[true,'Please add a title'],
            trim:true,
        },
        description:{
            type:String,
            trim:true,
            default:'',
        },
        completed:{
            type:Boolean,
            default:false,
        },
        completedAt:{
            type:Date,
            default:null,
        },
    },
    {
        timestamps:true,
    }
)

TodoSchema.index({userId:1,createdAt:-1})
module.exports=mongoose.model('Todo',TodoSchema)