const db = require('../models/db');

// 1. TAMBAH TRANSAKSI (CREATE)
exports.createTransaction = async (req, res) => {
  const { type, amount, description, date } = req.body;
  const userId = req.user.id; // Diambil dari JWT Token via middleware

  if (!type || !amount || !date) {
    return res.status(400).json({ message: 'Type, amount, dan date wajib diisi!' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO transactions (user_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [userId, type, amount, description, date]
    );

    res.status(201).json({
      message: 'Transaksi berhasil dicatat',
      transaction: { id: result.insertId, userId, type, amount, description, date }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 2. AMBIL SEMUA TRANSAKSI USER (READ)
exports.getTransactions = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. UPDATE TRANSAKSI (UPDATE)
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { type, amount, description, date } = req.body;
  const userId = req.user.id;

  try {
    // Pastikan transaksi itu milik user yang sedang login sebelum di-update
    const [tx] = await db.execute('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    if (tx.length === 0) {
      return res.status(444).json({ message: 'Transaksi tidak ditemukan atau akses ditolak!' });
    }

    await db.execute(
      'UPDATE transactions SET type = ?, amount = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
      [type || tx[0].type, amount || tx[0].amount, description || tx[0].description, date || tx[0].date, id, userId]
    );

    res.json({ message: 'Transaksi berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. HAPUS TRANSAKSI (DELETE)
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Pastikan transaksi milik user sebelum dihapus
    const [result] = await db.execute('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan atau akses ditolak!' });
    }

    res.json({ message: 'Transaksi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};