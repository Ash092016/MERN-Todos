import {Navigate,useLocation} from 'react-router-dom'
import {useAuth} from '../context/AuthContext'

const ProtectedRoute=({children})=>{
    const {user,loading}=useAuth()
    const location=useLocation()

    if(loading){
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
                <div className='flex flex-col items-center gap-4'>
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className='text-lg font-medium text-gray-600 dark:text-gray-300'>
                        Authenticating...
                    </p>
                </div>
            </div>
        )
    }
    if(!user){
        return <Navigate to='/login' state={{from:location}} replace />
    }
    return children
}
export default ProtectedRoute