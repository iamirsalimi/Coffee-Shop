const tokenStore = {
    get: () => localStorage.getItem('accessToken'),
    set: token => localStorage.setItem('accessToken', token),
    clear: () => localStorage.removeItem('accessToken')
}

export async function autoFetch(url, options = {}, formDataFlag = false) {
    // First request
    let response = null;

    if (formDataFlag) {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${tokenStore.get()}`
            },
        });
    } else {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${tokenStore.get()}`,
                "Content-Type": "application/json",
            },
        });
    }

    // If access token still valid → return response
    if (response.status != 401) {
        return response;
    }

    // Try refresh token
    const refreshResponse = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
    });
    
    // Refresh failed → logout
    if (!refreshResponse.ok) {
        tokenStore.clear();
        throw new Error("Session expired");
    }
    
    const { token } = await refreshResponse.json();
    console.log('refreshResponse' , refreshResponse , token)
    tokenStore.set(token);

    // Retry original request
    if (formDataFlag) {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`
            },
        });
    } else {
        response = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
    }

    return response
}
