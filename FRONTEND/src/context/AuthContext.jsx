import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCurrentUser = useCallback(async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data?.data || null);
        } catch {
            // Silently fail — user is not logged in (no cookies present)
            // The axios interceptor will NOT redirect here because
            // the refresh-token call also fails silently on first load
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    const value = {
        user,
        loading,
        isLoggedIn: !!user,
        login,
        logout,
        refetchUser: fetchCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
