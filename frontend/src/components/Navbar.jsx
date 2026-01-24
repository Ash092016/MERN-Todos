import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate, Link } from 'react-router-dom'

const Navbar=()=>{
    const {user,loading,logout}=useAuth()
    const {darkMode,toggleTheme}=useTheme()
    const navigate=useNavigate()

    const handleLogout=()=>{
        logout()
        navigate('/login')
    }

    return (
        <nav className='bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <div className='flex items-center'>
                        <Link to='/' className='text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-all duration-300'>
                            Todo App
                        </Link>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <button onClick={toggleTheme} className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 active:scale-95' aria-label='Toggle theme'>
                            {darkMode?(
                                <svg className='w-5 h-5 text-yellow-500' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z' />
                                </svg>
                            ):(
                                <svg className='w-5 h-5 text-gray-700' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'/>
                                </svg>
                            )}
                        </button>
                        {!loading &&(user?(
                            <div className='flex items-center space-x-4 border-l pl-4 border-gray-200 dark:border-gray-700 transition-colors duration-300'>
                                <span className='text-gray-700 dark:text-gray-300 hidden sm:block font-medium'>
                                    {user.name}
                                </span>
                                <button onClick={handleLogout} className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95'>
                                    Logout
                                </button>
                            </div>
                        ):(
                            <Link to='/login' className='text-blue-600 dark:text-blue-400 font-medium hover:opacity-70 transition-all duration-300'>Login</Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default Navbar