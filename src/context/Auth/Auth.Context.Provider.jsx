import { useState } from "react"
import { AuthContext } from "./Auth.Context"

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

    const updateUser = (userData) => {
        setUser(userData)
        if (userData) {
            localStorage.setItem('user', JSON.stringify(userData))
        } else {
            localStorage.removeItem('user')
        }
    }

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser: updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}