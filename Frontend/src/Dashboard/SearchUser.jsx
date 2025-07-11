import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const initialUserState = localStorage.getItem("auth");
    const [authUser, setAuthUser] = useState(initialUserState ? JSON.parse(initialUserState) : undefined);

    const token = authUser?.token || authUser?.user?.token;

    useEffect(() => {
        const verifyToken = async () => {
            try {
                if (token) {
                    const result = await fetch("/api/check_Token", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({}) // you can pass data if needed
                    });

                    const data = await result.json();

                    if (!data.success) {
                        // token invalid or expired
                        localStorage.removeItem("auth");
                        setAuthUser(undefined);
                    }
                }
            } catch (err) {
                console.error("Token check failed:", err);
                localStorage.removeItem("auth");
                setAuthUser(undefined);
            }
        };

        verifyToken();
    }, [token]);

    return (
        <AuthContext.Provider value={[authUser, setAuthUser]}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
