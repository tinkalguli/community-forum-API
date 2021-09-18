const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");

require("dotenv").config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const profilesRouter = require('./routes/profile');
const questionsRouter = require('./routes/questions');

mongoose.connect("mongodb://localhost/community-forum",
{ useNewUrlParser : true, useUnifiedTopology : true },
() => {
    console.log("Connected");
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profilesRouter);
app.use('/api/questions', questionsRouter);

module.exports = app;
