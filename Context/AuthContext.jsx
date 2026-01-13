import { createContext, useContext, useEffect, useState } from "react";
// import api from "@/src/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true);
    const [getData, setGetData] = useState(true);

    // LOGOUT
    const logout = async () => {
        try {
            let res = await fetch("/api/auth/logout")
            if (res.status == 200) {
                localStorage.removeItem('accessToken')
            }
        } catch {
            console.log('Unknown err')
        }

        setUser(null);
        setAccessToken(null);
    };

    // LOAD USER (ON REFRESH)
    const loadUser = async () => {
        try {
            const res = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            const resData = await res.json()
            console.log(resData)
            if (res.status == 201) setUser(resData.data)
            // console.log("user details : ", resData.data, res)

        } catch (err) {
            console.log(err)
            setUser(null)
            setAccessToken(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUser();
    }, [getData]);

    // useEffect(() => {
    //     console.log(user)
    // }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                loading,
                logout,
                setUser,
                setGetData
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);