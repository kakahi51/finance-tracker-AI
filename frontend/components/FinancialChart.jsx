import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinancialChart({ transactions }) {
  
  // LOGIKA AGREGASI DATA: Mengelompokkan & menjumlahkan transaksi per tanggal
  const processData = () => {
    const dailyData = {};

    // Urutkan transaksi dari tanggal tertua ke terbaru untuk grafik yang kronologis
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTransactions.forEach((t) => {
      const dateStr = new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { tanggal: dateStr, Pemasukan: 0, Pengeluaran: 0 };
      }

      if (t.type === 'income') {
        dailyData[dateStr].Pemasukan += parseFloat(t.amount);
      } else {
        dailyData[dateStr].Pengeluaran += parseFloat(t.amount);
      }
    });

    // Mengubah objek menjadi array yang siap dibaca oleh Recharts
    return Object.values(dailyData);
  };

  const chartData = processData();

  if (chartData.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666' }}>Belum ada data grafik untuk ditampilkan.</p>;
  }

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee', marginTop: '20px' }}>
      <h3 style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>Tren Keuangan Harian</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tanggal" />
            <YAxis tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
            <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
            <Legend />
            {/* Batang Hijau untuk Pemasukan */}
            <Bar dataKey="Pemasukan" fill="#2e7d32" radius={[4, 4, 0, 0]} />
            {/* Batang Merah untuk Pengeluaran */}
            <Bar dataKey="Pengeluaran" fill="#c62828" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}