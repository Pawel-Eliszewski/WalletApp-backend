const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
require('./config/config.passport')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
const usersRouter = require('./routes/api/user.routes');
const transactionsRouter = require('./routes/api/transaction.routes');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/api/user', usersRouter);
app.use('/api/transaction', transactionsRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(500).json({message: err.message});
});

module.exports = app;
