import api from './api'

export const learningApi = {
    getDashboardBootstrap: async () => (await api.get('/api/dashboard/bootstrap')).data,
    getLanguages: async () => (await api.get('/api/languages')).data,
    getLevels: async () => (await api.get('/api/levels')).data,
    getProfile: async () => (await api.get('/api/users/me')).data,
    updateProfile: async (profile) => (await api.put('/api/users/me', profile)).data,
    updateLearningLanguage: async (learning_language) => (await api.patch('/api/users/me/language', { learning_language })).data,
    getAssessments: async (params) => (await api.get('/api/assessments', { params })).data,
    submitAssessment: async (assessmentId, answers) => {
        const payload = { answers: Object.fromEntries(Object.entries(answers || {}).map(([key, value]) => [String(key), value ?? ''])) }
        return (await api.post(`/api/assessments/${assessmentId}/submit`, payload)).data
    },
    getProgress: async () => (await api.get('/api/progress/me')).data,
    getLearningState: async () => (await api.get('/api/learning-state/me')).data,
    completeLesson: async (payload) => (await api.post('/api/lesson-progress', payload)).data,
}
