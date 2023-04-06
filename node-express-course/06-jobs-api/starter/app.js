require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDb = require('./db/connect')
const authenticateUser = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')

app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/jobs', authenticateUser, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
