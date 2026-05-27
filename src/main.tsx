import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  //stricMode hace que se renderize 2 veces cada componente para detectar erorres
  <StrictMode>
    <App />
  </StrictMode>,
)
