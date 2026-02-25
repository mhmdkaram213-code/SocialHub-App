import { useState } from "react"
import { AuthContext } from "./Auth.Context"

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}