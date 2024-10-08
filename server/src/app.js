const express = require('express');
// const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');
const path = require('path');
const videoRouter = require('./routes/videoRouter');
const uploadRouter = require('./routes/uploadRouter');
const adminRouter = require('./routes/adminRouter');
const watchedVideoRouter = require('./routes/watchedVideoRouter');
const historyRouter = require('./routes/historyRouter');
const likeRoutes = require('./routes/likeRouter');

const app = express();

// app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Статическая папка для доступа к видеофайлам и превьюшкам
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/videos', videoRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/admin', adminRouter);
app.use('/api/watched-videos', watchedVideoRouter);
app.use('/api/history', historyRouter);
app.use('/api/tokens', tokensRouter);
app.use('/api/auth', authRouter);
app.use('/api/likedVideos', likeRoutes); // Регистрируем маршрут для лайков
module.exports = app;
