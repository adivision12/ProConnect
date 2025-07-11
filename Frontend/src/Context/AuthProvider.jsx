import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const initialUserState = localStorage.getItem("auth");
    const [authUser, setAuthUser] = useState(initialUserState ? JSON.parse(initialUserState) : undefined);

    useEffect(() => {
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
  }, []);
    return (
        <AuthContext.Provider value={[ authUser, setAuthUser ]}>
            {children}
        </AuthContext.Provider>
        
    )
}
 
export const useAuth = () => useContext(AuthContext);
