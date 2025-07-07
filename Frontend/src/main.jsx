import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './Context/AuthProvider.jsx'
import { DataProvider } from './Context/DataProvider.jsx'
import ConnectionsProvider from './Context/ConnectionsProvider.jsx'

createRoot(document.getElementById('root')).render(
    <AuthProvider>
 <DataProvider>
   <ConnectionsProvider>
       <BrowserRouter>
 <App />
 </BrowserRouter>
   </ConnectionsProvider>
 </DataProvider>
    </AuthProvider>

    
)
