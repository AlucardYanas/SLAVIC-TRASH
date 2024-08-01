const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRouter');
const tokensRouter = require('./routes/tokensRouter');

// const booksRouter = require('./routes/books.api.routes');
const app = express();


app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use('/api/books', booksRouter);
app.use('/api/auth', authRouter);
app.use('/api/tokens', tokensRouter);

module.exports = app;