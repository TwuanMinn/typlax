const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface ApiResponse<T> {
    data?: T
    error?: string
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        const error = await response.json()
        return { error: error.message || 'An error occurred' }
    }
    const data = await response.json()
    return { data }
}

// Auth API
export const authApi = {
    async signup(email: string, password: string, username: string) {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username }),
        })
        return handleResponse(response)
    },

    async login(email: string, password: string) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        return handleResponse(response)
    },

    async logout() {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
        })
        return handleResponse(response)
    },
}

// Tests API
export const testsApi = {
    async saveResult(result: {
        userId: string
        modeId: string
        wpm: number
        rawWpm: number
        accuracy: number
        duration: number
        textLength: number
        correctChars: number
        incorrectChars: number
    }) {
        const response = await fetch(`${API_BASE}/tests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
        })
        return handleResponse(response)
    },

    async getHistory(userId: string, limit = 20, offset = 0) {
        const response = await fetch(
            `${API_BASE}/tests/${userId}?limit=${limit}&offset=${offset}`
        )
        return handleResponse(response)
    },

    async getStats(userId: string) {
        const response = await fetch(`${API_BASE}/tests/${userId}/stats`)
        return handleResponse(response)
    },
}

// Leaderboard API
export const leaderboardApi = {
    async getGlobal(limit = 50, modeId?: string) {
        const params = new URLSearchParams({ limit: limit.toString() })
        if (modeId) params.append('modeId', modeId)

        const response = await fetch(`${API_BASE}/leaderboard?${params}`)
        return handleResponse(response)
    },

    async getDaily(limit = 50) {
        const response = await fetch(`${API_BASE}/leaderboard/daily?limit=${limit}`)
        return handleResponse(response)
    },

    async getByMode(modeId: string, limit = 50) {
        const response = await fetch(
            `${API_BASE}/leaderboard/mode/${modeId}?limit=${limit}`
        )
        return handleResponse(response)
    },
}

// User API
export const userApi = {
    async getProfile(userId: string) {
        const response = await fetch(`${API_BASE}/users/${userId}`)
        return handleResponse(response)
    },

    async updateProfile(userId: string, data: {
        username?: string
        displayName?: string
        avatarUrl?: string
    }) {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return handleResponse(response)
    },

    async updatePreferences(userId: string, preferences: {
        theme?: string
        soundEnabled?: boolean
        showKeyboard?: boolean
        fontSize?: string
    }) {
        const response = await fetch(`${API_BASE}/users/${userId}/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preferences),
        })
        return handleResponse(response)
    },
}
