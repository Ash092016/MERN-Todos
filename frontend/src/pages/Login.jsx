import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)
    
    const {login,user,loading:authLoading}=useAuth()
    const navigate=useNavigate()
    const location=useLocation()

    useEffect(()=>{
        if(user){
            navigate('/')
        }
    },[user,navigate])

    if(authLoading){
        return null
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(loading) return 
        setError('')
        setLoading(true)

        try{
            await login(email.trim().toLowerCase(),password)

            const from=location.state?.from?.pathname||'/'
            navigate(from,{replace:true})
        }
        catch(error){
            setError(typeof error==='string'?error:'Failed to login')
        }
        finally{
            setLoading(false)
        }
    }

    return(
        <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300'>
            <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 transform transition-all'>
                <h2 className='text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2'>Welcome Back</h2>
                <p className='text-center text-gray-500 dark:text-gray-400 mb-8'>Login to manage your tasks</p>

                {error && (
                    <div className='bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded mb-6 animate-shake'>
                        <p className='text-sm font-medium'>{error}</p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Email Address</label>
                        <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required className='w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all' placeholder='name@company.com'/>
                    </div>
                    <div>
                        <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>Password</label>
                        <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required className='w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all' placeholder='••••••••'/>
                    </div>
                    <button type='submit' disabled={loading} className='w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2'>
                        {loading?(
                            <span className='flex items-center justify-center gap-2'>
                                <svg className='animate-spin h-5 w-5 text-white' viewBox='0 0 24 24'>
                                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none'/>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'/>
                                </svg>
                                Logging in...
                            </span>
                        ):'Login'}
                    </button>
                </form>
                <p className='mt-8 text-center text-sm text-gray-500 dark:text-gray-400 font-medium'>Don't have an account?{' '}
                    <Link to='/signup' className='text-blue-600 dark:text-blue-400 hover:underline font-bold'>Sign up here</Link>
                </p>
            </div>
        </div>
    )
}
export default Login