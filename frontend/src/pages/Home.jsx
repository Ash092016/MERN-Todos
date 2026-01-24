import {useState,useEffect,useMemo} from 'react'
import api from '../api/axios'

import {useAuth} from '../context/AuthContext'
import Navbar from '../components/Navbar'
import TodoItem from '../components/TodoItem'

const Home=()=>{
    const [todos,setTodos]=useState([])
    const [loading,setLoading]=useState(true)
    const [newTodoTitle,setNewTodoTitle]=useState('')
    const [newTodoDescription,setNewTodoDescription]=useState('')
    const [selectedDate,setSelectedDate]=useState('all')
    const [error,setError]=useState('')

    const filteredTodos=useMemo(()=>{
        if(selectedDate==='all') return todos
        return todos.filter((todo)=>{
            const todoDate=new Date(todo.createdAt).toDateString()
            const filterDate=new Date(selectedDate).toDateString()
            return todoDate===filterDate
        })
    },[todos,selectedDate])

    useEffect(()=>{
        fetchTodos()
    },[])

    const fetchTodos=async()=>{
        setError('')
        try{
            const {data}=await api.get('/api/todos')
            setTodos(data.data||[])
        }
        catch(error){
            setError(error.response?.data?.message || 'Failed to fetch todos')
        }
        finally{
            setLoading(false)
        }
    }

    const handleAddTodo=async(e)=>{
        e.preventDefault()
        if(!newTodoTitle.trim()) return 

        try{
            const {data}=await api.post('/api/todos',{
                title:newTodoTitle.trim(),
                description:newTodoDescription.trim(),
            })
            setTodos((prev)=>[data.data,...prev])
            setNewTodoTitle('')
            setNewTodoDescription('')
            setError('')
        }
        catch(error){
            setError(error.response?.data?.message||'Failed to add todo')
        }
    }

    const handleUpdateTodo=async(id,updates)=>{
        try{
            const {data}=await api.put(`/api/todos/${id}`,updates)
            setTodos((prev)=>prev.map((todo)=>(todo._id===id?data.data:todo)))
        }
        catch(error){
            setError(error.response?.data?.message||'Failed to update todo')
        }
    }

    const handleDeleteTodo=async(id)=>{
        try{
            await api.delete(`/api/todos/${id}`)
            setTodos((prev)=>prev.filter((todo)=>todo._id!==id))
        }
        catch(error){
            setError(error.response?.data?.message||'Failed to delete todo')
        }
    }

    const uniqueDates=useMemo(()=>{
        const dates=todos.map((todo)=>new Date(todo.createdAt).toDateString())
        return [...new Set(dates)]
    },[todos])

    if(loading){
        return(
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
                <Navbar/>
                <div className='flex flex-col items-center justify-center pt-20'>
                    <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4'></div>
                    <p className='text-xl font-medium text-gray-600 dark:text-gray-400'>Loading your tasks...</p>
                </div>
            </div>
        )
    }

    return(
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-12'>
            <Navbar/>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                {error && (
                    <div className='bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-lg mb-6 shadow-sm animate-shake'>
                        <p className='font-medium text-sm'>{error}</p>
                    </div>
                )}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700'>
                    <h2 className='text-2xl font-extrabold text-gray-900 dark:text-white mb-6'>New Task</h2>
                    <form onSubmit={handleAddTodo} className='space-y-4'>
                        <input type='text' value={newTodoTitle} onChange={(e)=>setNewTodoTitle(e.target.value)} placeholder='What needs to be done?' className='w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all text-lg' required/>
                        <textarea value={newTodoDescription} onChange={(e)=>setNewTodoDescription(e.target.value)} placeholder='Add a description (optional)' className='w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all resize-none' rows='2'/>
                        <div className='flex justify-end'>
                            <button type='submit' className='w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all'>Create Task</button>
                        </div>
                    </form>
                </div>
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4 mb-8'>
                    <div className='flex items-center gap-4 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
                        <label className='text-xs font-black text-gray-400 dark:text-gray-500 ml-2 tracking-widest'>FILTER</label>
                        <select value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className='bg-transparent text-gray-700 dark:text-gray-200 font-bold outline-none cursor-pointer pr-4'>
                            <option value='all'>All Dates</option>
                            {uniqueDates.map((date)=>(
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>
                    <div className='text-gray-400 dark:text-gray-500 font-bold text-xs tracking-widest uppercase'>{filteredTodos.length} Tasks total</div>
                </div>
                <div className='space-y-4'>
                    {filteredTodos.length===0?(
                        <div className='bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center'>
                            <p className='text-gray-400 dark:text-gray-500 font-medium'>No tasks found. Start your day by adding one above!</p>
                        </div>
                    ):(filteredTodos.map((todo)=>(<TodoItem key={todo._id} todo={todo} onUpdate={handleUpdateTodo} onDelete={handleDeleteTodo}/>)))}
                </div>
            </div>
        </div>
    )
}
export default Home
