"use client"
import { createContext, useContext, useEffect, useState } from 'react'

const authContext = createContext({
    user: null,
    setUser: (user: any) => {},
})

export function AuthManager({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        var sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId='))?.split('=')[1];
        if (sessionId) {
            console.log('Session ID found:', sessionId);
            fetch('/api/user/session').then(res => res.json()).then((data) => {
                setUser(data);
            });
        } else {
            console.log('No session ID found, redirecting to Keystone');
            window.location.href = process.env.NEXT_PUBLIC_KEYSTONE_URL + "/auth/redirect?appId=" + process.env.NEXT_PUBLIC_APP_ID + "&redirectUrl=" + window.location.href;
        }
        if (window.location.href.includes('sessionId=')) {
            const sessionId = window.location.href.split('sessionId=')[1];
            console.log('Session ID found in URL:', sessionId);
            const url = new URL(window.location.href);
            url.searchParams.delete('sessionId');
            window.location.href = url.toString();
            document.cookie = `sessionId=${sessionId}; path=/; max-age=3600`;
        }
    }, []);
    return (
        <authContext.Provider value={{ user, setUser }}>
            {children}
        </authContext.Provider>
    )
}

export function useAuth() {
    return useContext(authContext);
}