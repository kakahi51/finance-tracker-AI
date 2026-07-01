import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'
import { TransactionProvider } from './hooks/useTransactions.jsx' // Impor provider baru
import "./index.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TransactionProvider> {/* Taruh di sini */}
        <App />
      </TransactionProvider>
    </AuthProvider>
  </React.StrictMode>,
)