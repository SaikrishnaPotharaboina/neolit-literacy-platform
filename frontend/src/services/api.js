import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (
    import.meta.env.PROD
        ? 'https://neolit-literacy-platform-1.onrender.com'
        : 'http://localhost:8000'
)

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api
