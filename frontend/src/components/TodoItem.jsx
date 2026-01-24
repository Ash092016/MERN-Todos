import { useState, useEffect, memo } from 'react';

const TodoItem=({todo,onUpdate,onDelete})=>{
    const [isEditing,setIsEditing]=useState(false)
    const [editTitle,setEditTitle]=useState(todo.title)
    const [editDescription,setEditDescription]=useState(todo.description||'')
    const [isSaving,setIsSaving]=useState(false)

    useEffect(()=>{
        setEditTitle(todo.title)
        setEditDescription(todo.description||'')
    },[todo])

    const handleUpdate=async ()=>{
        if(!editTitle.trim()){
            alert('Title is required')
            return
        }
        setIsSaving(true)
        try{
            await onUpdate(todo._id,{
                title:editTitle.trim(),
                description:editDescription.trim(),
                completed:todo.completed
            })
            setIsEditing(false)
        }
        catch(error){
            alert('Failed to update todo. Please try again.')
        }
        finally{
            setIsSaving(false)
        }
    }

    const handleDelete=async()=>{
        if(window.confirm('Are you sure you want to delete this task?')){
            try{
                await onDelete(todo._id)
            }
            catch(error){
                alert('Failed to delete. Please check your connection')
            }
        }
    }

    const handleCancel=()=>{
        setEditTitle(todo.title)
        setEditDescription(todo.description||'')
        setIsEditing(false)
    }

    const handleToggleComplete=()=>{
        onUpdate(todo._id,{
            ...todo,
            completed:!todo.completed
        })
    }

    const formatDate=(dateString)=>{
        if(!dateString) return 'N/A'
        const date=new Date(dateString)
        if(isNaN(date.getTime())) return 'Invalid Date'
        return date.toLocaleString('en-US',{
            month:'short',day:'numeric',year:'numeric',
            hour:'2-digit',minute:'2-digit',
        })
    }

    if(isEditing){
        return(
            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-2 border-blue-500 transition-all'>
                <input type='text' value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className='w-full p-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none' placeholder='Todo Title' aria-label='Edit Title'/>
                <textarea disabled={isSaving} value={editDescription} onChange={(e)=>setEditDescription(e.target.value)} className='w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none' placeholder='Description (optional)' rows='2' aria-label='Edit description'/>
                <div className='flex space-x-2'>
                    <button onClick={handleUpdate} disabled={isSaving} className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all active:scale-95'>{isSaving?'Saving...':'Save'}</button>
                    <button onClick={handleCancel} disabled={isSaving}className='px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white font-medium rounded-lg transition-all active:scale-95'>Cancel</button>
                </div>
            </div>
        )
    }

    return(
        <div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-all group'>
            <div className='flex items-start space-x-3'>
                <input type='checkbox' checked={todo.completed} onChange={handleToggleComplete} className='mt-1.5 w-5 h-5 cursor-pointer text-blue-600 rounded focus:ring-2 focus:ring-blue-500 transition-transform active:scale-125'/>
                <div className='flex-1 min-w-0'>
                    <h3 className={`text-lg font-semibold truncate ${todo.completed?'line-through text-gray-400 dark:text-gray-500':'text-gray-800 dark:text-gray-100'}`}>{todo.title}</h3>
                    {todo.description && (
                        <p className='text-gray-600 dark:text-gray-400 mt-1 break-words'>{todo.description}</p>
                    )}
                    <div className='text-xs text-gray-500 dark:text-gray-500 mt-3 flex flex-wrap gap-x-4 gap-y-1'>
                        <span>Created: {formatDate(todo.createdAt)}</span>
                        {todo.completed && todo.completedAt && (<span className='text-green-600 dark:text-green-500 font-medium'>✓ Done: {formatDate(todo.completedAt)}</span>)}
                    </div>
                </div>
                <div className='flex space-x-1'>
                    <button onClick={()=>{
                        setIsEditing(true)
                    }} className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all' aria-label='Edit'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                        </svg>
                    </button>
                    <button onClick={handleDelete} className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all' aria-label='Delete'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default memo(TodoItem)
