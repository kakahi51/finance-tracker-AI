import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'; // PENTING: Tambah Link di sini
import styles from './auth.module.css'; // PENTING: Hubungkan CSS lo agar tidak polosan

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password); 

    if (result && result.success) {
      navigate('/dashboard');
    } else {
      setError(result?.message || 'Login gagal, periksa koneksi backend lo.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>Login Finance Tracker</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Masukkan email lo"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Masukkan password"
              required 
            />
          </div>

          <button type="submit" className={styles.authButton}>Login</button>
        </form>

        {/* TOMBOL REGISTER YANG HILANG SUDAH DI SINI */}
        <p className={styles.authSwitchText}>
          Belum punya akun? <Link to="/register" className={styles.authLink}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}