import React from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import AddTransactionForm from '../components/AddTransactionForm';
import FinancialChart from '../components/FinancialChart';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { transactions, loading, error, refetch } = useTransactions();

  // LOGIKA MATEMATIKA DATA
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const sisaSaldo = totalIncome - totalExpense;

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin mau hapus transaksi ini?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refetch();
    } catch (err) {
      console.error("Gagal menghapus transaksi:", err);
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fdfdfd' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Halo, {user?.name || 'User'}! 👋</h2>
          <p style={{ color: '#666', margin: '5px 0 0 0' }}>Email lo: {user?.email}</p>
        </div>
        <button 
          onClick={logout} 
          style={{ padding: '8px 16px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

      {/* FORM INPUT TRANSAKSI */}
      <AddTransactionForm />

      {/* KONTEN UTAMA 1: SUMMARY BOARD (Hanya berisi 3 kartu indikator uang) */}
      <div style={{ display: 'flex', gap: '20px', margin: '2rem 0' }}>
        {/* Box Saldo */}
        <div style={{ flex: 1, padding: '20px', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
          <h4 style={{ margin: 0, color: '#0d47a1' }}>Sisa Saldo</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: sisaSaldo >= 0 ? '#1b5e20' : '#b71c1c' }}>
            Rp {sisaSaldo.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Box Pemasukan */}
        <div style={{ flex: 1, padding: '20px', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #a5d6a7' }}>
          <h4 style={{ margin: 0, color: '#1b5e20' }}>Total Pemasukan</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#2e7d32' }}>
            + Rp {totalIncome.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Box Pengeluaran */}
        <div style={{ flex: 1, padding: '20px', background: '#ffebee', borderRadius: '8px', border: '1px solid #ef9a9a' }}>
          <h4 style={{ margin: 0, color: '#b71c1c' }}>Total Pengeluaran</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0 0 0', color: '#c62828' }}>
            - Rp {totalExpense.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* KONTEN UTAMA 2: GRAFIK ANALISIS (Berdiri sendiri di baris baru, full width) */}
      <div style={{ margin: '2rem 0' }}>
        <FinancialChart transactions={transactions} />
      </div>

      <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '2rem 0' }} />

      {/* KONTEN UTAMA 3: LIST RIWAYAT TRANSAKSI */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Riwayat Transaksi</h3>
        
        {loading && <p>Sedang memuat data transaksi...</p>}
        {error && <p style={{ color: 'red' }}>Eror: {error}</p>}
        {!loading && transactions.length === 0 && <p style={{ color: '#666' }}>Belum ada data transaksi.</p>}

        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1rem' }}>
          {transactions.map((t) => (
            <li key={t.id} style={{ 
              padding: '12px', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ color: t.type === 'income' ? '#2e7d32' : '#c62828' }}>
                  {t.description}
                </strong>
                <small style={{ color: '#666', marginLeft: '8px' }}>
                  — {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </small>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontWeight: 'bold', color: t.type === 'income' ? '#2e7d32' : '#c62828' }}>
                  {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                </span>
                <button 
                  onClick={() => handleDelete(t.id)}
                  style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}