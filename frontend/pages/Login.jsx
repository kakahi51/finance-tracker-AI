import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // JANGAN kirim pake objek seperti login({ email, password }) 
    // Kirim sebagai dua argumen terpisah sesuai fungsi di useAuth.jsx lo!
    const result = await login(email, password); 

    // Proteksi: pastikan result tidak undefined sebelum baca .success
    if (result && result.success) {
      navigate('/dashboard');
    } else {
      setError(result?.message || 'Login gagal');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}