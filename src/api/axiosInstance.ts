import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '')
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    return response
  },
  async (error) => {
    const url: string = error.config?.url ?? ''

    if (error.response?.status !== 401) return Promise.reject(error)

    // login y refresh: el caller maneja el error directamente
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) return Promise.reject(error)

    // ya se reintentó una vez — evita loop infinito si el retry también da 401
    if (error.config._retry) return Promise.reject(error)
    error.config._retry = true

    try {
      await api.post('/auth/refresh')
      return api(error.config)
    } catch {
      // /auth/me lo maneja useAuthInit → clearAuth → AuthGate redirige a /login
      if (!url.includes('/auth/me')) window.location.href = '/login'
      return Promise.reject(error)
    }
  }
)

export default api
