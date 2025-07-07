import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const initialUserState = localStorage.getItem("user");
    const [authUser, setAuthUser] = useState(initialUserState ? JSON.parse(initialUserState) : undefined);

    return (
        <AuthContext.Provider value={[ authUser, setAuthUser ]}>
            {children}
        </AuthContext.Provider>
        
    )
}
 
export const useAuth = () => useContext(AuthContext);
