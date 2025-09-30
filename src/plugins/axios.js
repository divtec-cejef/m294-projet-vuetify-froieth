import axios from 'axios'
const baseURL = import.meta.env.DEV // mode développement (npm run dev)
  ? '/deezer' // ← passer par le proxy VITE pour éviter les soucis CORS quand on est en mode DEV
  : import.meta.env.VITE_API_BASE_URL // ← accès direct à l'URL de l'API lorsqu'on est en production
const api = axios.create({
  baseURL, // Assure-toi que cette variable est définie dans ton .env
  timeout: 10_000, // 10 secondes de timeout
})
// Si l'API utilise une clé dans les params (ex. ?key=API_KEY)
api.defaults.params = api.defaults.params || {}
api.defaults.params.key = import.meta.env.VITE_API_KEY
// Sinon, pour un header Authorization :
// api.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_API_KEY

export default api
