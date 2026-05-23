import axios from 'axios'

// Instancia compartida por todos los módulos — base URL viene del .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // envía la cookie httpOnly con el JWT en cada request
})

// Intercepta todas las respuestas antes de que lleguen a los hooks
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
        // /auth/me lo maneja useAuthInit. si redirigimos acá causaría loop infinito en el login
    if (error.response?.status === 401 && !url.includes('/auth/me')) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api