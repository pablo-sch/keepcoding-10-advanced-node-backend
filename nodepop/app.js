//CommomJS (default)--> ES Modules--------------------------------------------------------------

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import connectMongoose from './lib/connectMongoose.js'; 

import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';

//Connect to MongoDB=========================================================
await connectMongoose();

const app = express();

//Configuring the view engine=================================================
app.set('views', 'views'); //app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, 'public'))); //app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Handling Errors=============================================================

//catch 404 and pass to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//handle error
app.use((err, req, res, next) => {
  //set local variables, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render error page
  res.status(err.status || 500);
  res.render('error');
});

//============================================================================

export default app;
