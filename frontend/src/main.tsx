import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(  //render = react component ko dom maidisplay krna
  <StrictMode>
    <App />
  </StrictMode>
)