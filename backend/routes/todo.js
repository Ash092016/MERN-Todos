const express=require('express')
const router=express.Router()
const Todo=require('../models/Todo')
const {protect}=require('../middleware/auth')

//Endpoint to get all the todos for a user 
router.get('/',protect,async (req,res,next)=>{
    try{
        const todos=await Todo.find({userId:req.user._id}).sort({createdAt:-1})
        res.json(todos)
    }
    catch(error){
        next(error)
    }
})

//Endpoint to get Todos by date
router.get('/date/:date',protect,async (req,res,next)=>{
    try{
        const date=new Date(req.params.date)
        const nextDay=new Date(date)
        nextDay.setDate(nextDay.getDate()+1)

        const todos=await Todo.find({
            userId:req.user._id,
            createdAt:{
                $gte:date,
                $lt:nextDay,
            },
        }).sort({createdAt:-1})

        res.json(todos)
    }
    catch(error){
        next(error)
    }
})

//Endpoint to create a new Todo
router.post('/',protect,async (req,res,next)=>{
    try{
        const {title,description}=req.body

        if(!title){
            res.status(400)
            throw new Error('Please provide a title')
        }

        const todo=await Todo.create({
            userId:req.user._id,
            title,
            description:description || '',
        })
        res.status(201).json(todo)
    }
    catch(error){
        next(error)
    }
})

//Endpoint to update a todo
router.put('/:id',protect,async (req,res,next)=>{
    try{
        const todo=await Todo.findById(req.params.id)

        if(!todo){
            res.status(404)
            throw new Error('Todo not found')
        }

        if(todo.userId.toString() !== req.user._id.toString()){
            res.status(403)
            throw new Error('Not authorized')
        }

        const {title,description,completed}=req.body
        if(title!==undefined) todo.title=title
        if(description!==undefined) todo.description=description

        if(completed!==undefined){
            todo.completed=completed
            todo.completedAt=completed?new Date():null
        }

        const updatedTodo=await todo.save()
        res.json(updatedTodo)
    }
    catch(error){
        next(error)
    }
})

//Endpoint to delete a todo
router.delete('/:id',protect,async (req,res,next)=>{
    try{
        const todo=await Todo.findById(req.params.id)

        if(!todo){
            res.status(404)
            throw new Error('Todo not found')
        }

        if(todo.userId.toString() !== req.user._id.toString()){
            res.status(403)
            throw new Error('Not authorized')
        }

        await todo.deleteOne()
        res.json({message:'Todo deleted successfully'})
    }
    catch(error){
        next(error)
    }
})

module.exports=router