import api from './api'

export const authApi = {
    register: async (payload) => {
        const response = await api.post('/auth/register', payload)
        return response.data
    },

    login: async (payload) => {
        const response = await api.post('/auth/login', payload)
        return response.data
    },

    logout: async (token) => {
        const response = await api.post('/auth/logout', {}, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return response.data
    },

    getCurrentUser: async (token) => {
        const response = await api.get('/auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return response.data
    }
}
