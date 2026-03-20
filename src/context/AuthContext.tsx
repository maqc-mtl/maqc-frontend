import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    email: string;
    phoneNumber: string;
    role: string;
    firstName: string;
    lastName: string;
    planType: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, phone: string, role: string, firstName: string, lastName: string, planType: string) => void;
    logout: () => void;
    updatePlanType: (planType: string) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string, phoneNumber: string, role: string, firstName: string, lastName: string, planType: string) => {
        const userData = { email, phoneNumber, role, firstName, lastName, planType };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updatePlanType = (planType: string) => {
        if (user) {
            const updatedUser = { ...user, planType };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updatePlanType, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
