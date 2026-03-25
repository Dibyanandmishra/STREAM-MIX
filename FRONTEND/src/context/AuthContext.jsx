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
        } catch (err) {
            // Most of the time a current-user call failing means "not logged in".
            // For other failures, log for easier production debugging.
            if (err?.response?.status !== 401 && err?.response?.status !== 403) {
                console.error("fetchCurrentUser failed:", err?.response?.data || err?.message || err);
            }
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
