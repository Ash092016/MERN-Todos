import { createContext, useContext, useState, useEffect, useMemo, useCallback} from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(()=>{
        try{
            const savedTheme=localStorage.getItem('theme')
            if(savedTheme){
                return savedTheme==='dark'
            }
        }
        catch(error){
            console.warn('Error reading theme from localStorage:',error)
        }
        return window.matchMedia('(prefers-color-scheme:dark)').matches
    })

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add('dark')
            try{
                localStorage.setItem('theme','dark')
            }
            catch(error){}
        }
        else{
            document.documentElement.classList.remove('dark')
            try{
                localStorage.setItem('theme','light')
            }
            catch(error){}
        }
    }, [darkMode])

    const toggleTheme=useCallback(()=>{
        setDarkMode(prev=>!prev)
    },[])

    const value=useMemo(()=>({
        darkMode, toggleTheme
    }),[darkMode,toggleTheme])
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
