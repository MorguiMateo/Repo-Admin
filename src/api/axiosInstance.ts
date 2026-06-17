//reemplazo del fetch
import axios from 'axios'

//la base de la api. se configura con VITE_API_URL y si no, va a localhost para desarrollo
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  //le dice al navegador que incluya las cookies en los request. 
  // El backend usa cookies httpOnly para la sesion, estas las maneja automaticamente el navegador
  // el front nunca ve ni guarda tokens en localStorage
  withCredentials: true,
})

//logea en consola para debuggear 
api.interceptors.request.use((config) => {
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '')
  return config
})

//Maneja solo los 401. si el error viene de login o refresh, lo deja pasar.
//si ya se reintento lo deja pasar para que no haya loop infinito
//si no llama a al refresh para renovar access token y luego reintanta la request.
//si el refesh falla redirige al login.

//si hay error lo maneja sino retorna sin mas con un consolo log 
api.interceptors.response.use(
  (response) => {
    console.log(`[API] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    return response
  },
  async (error) => {
    const url: string = error.config?.url ?? ''

    if (error.response?.status !== 401) return Promise.reject(error)

    //login y refresh: el error lo maneja quien llama
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) return Promise.reject(error)

    //si ya se reintento una vez, lo dejamos pasar asi no se hace un loop infinito
    if (error.config._retry) return Promise.reject(error)
    error.config._retry = true

    try {
      await api.post('/auth/refresh')
      return api(error.config)
    } catch {
      //el /auth/me lo maneja useAuthInit (limpia la sesion y AuthGate manda al login)
      if (!url.includes('/auth/me')) window.location.href = '/login'
      return Promise.reject(error)
    }
  }
)

export default api
