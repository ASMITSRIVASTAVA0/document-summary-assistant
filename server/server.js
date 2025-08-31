const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documents');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
// app.use(cors({
//   origin: 'http://localhost:3000', // Allow requests from React dev server
//   credentials: true
// }));

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://document-summary-assistant-hmzf6sa0s.vercel.app',
    'https://document-summary-assistant-self.vercel.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/documents', documentRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '../client/build')));
  
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  // });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});