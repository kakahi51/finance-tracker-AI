import React, { useState } from 'react';
import axios from 'axios';
import { useTransactions } from '../hooks/useTransactions'; // Pastikan path hook lo bener

export default function AddTransactionForm() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // Default: pemasukan
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default: hari ini
  
  const { refetch } = useTransactions(); // Ambil fungsi refetch dari context

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description || !amount) {
      alert("Deskripsi dan nominal wajib diisi!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Kirim data baru ke backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, {
        description,
        amount: parseFloat(amount),
        type,
        date
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form kalau sukses
      setDescription('');
      setAmount('');
      
      // Pemicu sakti: Perbarui daftar transaksi di layar tanpa reload halaman
      refetch();
      
      alert('Transaksi berhasil dicatat!');
    } catch (err) {
      console.error("Gagal menambah transaksi:", err);
      alert(err.response?.data?.message || 'Gagal menyimpan transaksi');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0', borderRadius: '8px' }}>
      <h3>Tambah Transaksi Baru</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label>Deskripsi: </label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Contoh: Gaji Proyekan"
          />
        </div>
        
        <div>
          <label>Nominal (Rp): </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Contoh: 500000"
          />
        </div>

        <div>
          <label>Jenis: </label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Pemasukan (Income)</option>
            <option value="expense">Pengeluaran (Expense)</option>
          </select>
        </div>

        <div>
          <label>Tanggal: </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>

        <button type="submit" style={{ cursor: 'pointer', padding: '8px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
}