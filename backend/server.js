const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// allow requests from frontend — supports both local dev and production
app.use(cors({
  origin: true, // reflect the request origin — works for all environments
  credentials: true,
}));
app.use(express.json());

// mount all route groups
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/notes',     require('./routes/note.routes'));
app.use('/api/ai',        require('./routes/ai.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/share',     require('./routes/share.routes')); // public — no auth needed

// quick health check so we can verify the server is up
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// connect to MongoDB first, then start listening
// if DB fails we exit — no point running without a database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
    process.exit(1);
  });
