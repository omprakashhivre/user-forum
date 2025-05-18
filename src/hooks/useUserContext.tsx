import React, { createContext, useContext } from 'react';

interface UserContextType {
    name: string;
    id: string;
    email: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = UserContext.Provider;

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
