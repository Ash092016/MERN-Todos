import {Navigate} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const ProtectedRoute=({children})=>{
    const {user,loading}=useAuth()

    if(loading){
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900'>
                <div className='text-xl text-gray-600 dark:text-gray-300'>
                    Loading..
                </div>
            </div>
        )
    }
    return user?children:<Navigate to='/login' />
}