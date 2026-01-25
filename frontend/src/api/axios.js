import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user')
    if (user) {
        try {
            const parsedUser = JSON.parse(user)
            if (parsedUser && parsedUser.token) {
                config.headers.Authorization = `Bearer ${parsedUser.token}`
            }
        }
        catch (error) {
            console.error('Auth token parsing failed')
        }
    }
    return config
},
    (error) => {
        return Promise.reject(error)
    })

api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('user')
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    }
    return Promise.reject(error)
})

export default api