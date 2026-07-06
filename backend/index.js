require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

app.use(cors({origin:'*'}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server jalan!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({origin: '*' }));