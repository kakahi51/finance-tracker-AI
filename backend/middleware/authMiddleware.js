const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Ambil token dari header 'Authorization'
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ditemukan!' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lempar data id user ke request berikutnya
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid!' });
  }
};