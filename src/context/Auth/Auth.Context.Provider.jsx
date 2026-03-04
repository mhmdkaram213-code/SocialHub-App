import { useState, useEffect, useCallback } from "react"
import { AuthContext } from "./Auth.Context"
import { getUserProfile } from "../../services/api/userApi"

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    })
    const [isLoading, setIsLoading] = useState(true)

    // Core function to fetch profile and sync state
    const fetchProfile = useCallback(async (authToken) => {
        try {
            const res = await getUserProfile(authToken)
            if (res.success && res.data) {
                const userData = res.data;
                console.log("Successfully fetched profile data:", userData);
                setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData))
            } else {
                console.error("Profile fetch failed or returned no data:", res);
                // If token is invalid or profile fetch fails, clear everything
                setToken(null)
                setUser(null)
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        } catch (error) {
            console.error("Auth initialization error:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Startup session verification - still run in background even if we have cached user
    useEffect(() => {
        if (token) {
            fetchProfile(token)
        } else {
            setIsLoading(false)
        }
    }, [token, fetchProfile])

    const updateUser = useCallback((userData) => {
        if (!userData) return;

        setUser(prev => {
            // ROOT CAUSE BUG FIX: Handle possible nested 'user' or 'data' wrapper from API
            // Some endpoints return { user: { ... } }, others return { data: { ... } }
            // and some just return the user object directly.
            let newUserData = userData;
            if (userData.user) newUserData = userData.user;
            else if (userData.data) newUserData = userData.data;

            const updated = { ...prev, ...newUserData };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        })
    }, [])

    const updateToken = useCallback((newToken) => {
        setToken(newToken)
        if (newToken) {
            localStorage.setItem('token', newToken)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
        }
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }, [])

    return (
        <AuthContext.Provider value={{ token, setToken: updateToken, user, setUser: updateUser, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}
