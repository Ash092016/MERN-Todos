import {createContext, useContext, useState, useEffect,useMemo} from 'react'
import api from '../api/axios'

const AuthContext = createContext()

//creating custom hook for authentication
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try{
                setUser(JSON.parse(storedUser))
            }
            catch(error){
                console.error('Invalid user data in local storage',error)
                localStorage.removeItem('user')
                setUser(null)
            }
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try{
            const {data} = await api.post('/api/auth/login', { email, password })
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
            return data
        }
        catch(error){
            throw (error.response?.data?.message||'Login failed. Please try again.')
        }
    }

    const signup = async (name, email, password) => {
        try{
            const {data} = await api.post('/api/auth/signup', { name, email, password })
            setUser(data)
            localStorage.setItem('user', JSON.stringify(data))
            return data
        }
        catch(error){
            throw(error.response?.data?.message||'Signup failed. Please try again.')
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    const value = useMemo(() => ({
        user,
        loading,
        login,
        signup,
        logout,
    }), [user, loading])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
