import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Toggle from './toggle.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toggle/>
  </StrictMode>,
  
)
