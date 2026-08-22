import api from './api'

export const learningApi = {
    getCurricula: async (language) => {
        const response = await api.get('/learning/curricula', { params: language ? { language } : {} })
        return response.data
    },

    getAssessments: async (language) => {
        const response = await api.get('/learning/assessments', { params: language ? { language } : {} })
        return response.data
    },

    getDashboard: async () => {
        const response = await api.get('/learning/dashboard')
        return response.data
    },

    updateProfile: async (profile) => {
        const response = await api.put('/learning/profile', profile)
        return response.data
    },

    submitAssessment: async (assessmentId, answers) => {
        const response = await api.post(`/learning/assessments/${assessmentId}/attempts`, { answers })
        return response.data
    }
}
