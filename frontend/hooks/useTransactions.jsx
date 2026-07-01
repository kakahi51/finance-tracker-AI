import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Buat Context untuk menampung data transaksi secara global
const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi fetch sengaja dipisah biar bisa lo panggil ulang (refetch) nanti pas habis input transaksi baru
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Token tidak ditemukan, silakan login ulang.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      setTransactions(res.data);
      setError(null);
    } catch (err) {
      console.error("Gagal mengambil data transaksi:", err);
      setError(err.response?.data?.message || "Gagal mengambil data transaksi");
    } finally {
      setLoading(false);
    }
  };

  // Jalankan sekali saat aplikasi pertama kali dimuat
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, loading, error, refetch: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

// 2. Custom hook untuk dipakai di komponen Dashboard dll.
export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions harus digunakan di dalam komponen TransactionProvider");
  }
  return context;
}