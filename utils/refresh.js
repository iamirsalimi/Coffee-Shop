// utils/refreshToken.js
export async function refreshAccessToken() {
    const response = await fetch('/api/auth/refresh', {
        method: 'POST'
    });
    if (!response.ok) {
        localStorage.removeItem('accessToken');
        throw new Error('Refresh failed');
    }
    return response.json();
}