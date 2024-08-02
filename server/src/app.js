const express = require('express');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');
const path = require('path');
const videoRoutes = require('./routes/videoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const watchedVideoRoutes = require('./routes/watchedVideoRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();


// app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Статическая папка для доступа к видеофайлам и превьюшкам
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/watched-videos', watchedVideoRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/tokens', tokensRouter);
app.use('/api/auth', authRouter);

module.exports = app;