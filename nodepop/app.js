//CommomJS (default)--> ES Modules--------------------------------------------------------------

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import connectMongoose from './lib/connectMongoose.js'; 

import * as indexController from './src/controllers/indexController.js';
import * as userController from './src/controllers/userController.js';
import * as loginController from './src/controllers/loginController.js';


//Connect to MongoDB=========================================================
await connectMongoose();

const app = express();

//Configuring the view engine=================================================
app.set('views', 'views');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Variables Globales==========================================================
app.locals.appName = 'NodePoP';// --> toda variable que posea el nombre 'appName' en mis .ejs será nombrado 'NodePoP'

app.use(logger('dev')); // ???
app.use(express.json()); // ???
app.use(express.urlencoded({ extended: false })); // ???
app.use(cookieParser());// ???
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(import.meta.dirname, 'public'))); // ???

//Rutas de mi Aplicación======================================================

console.log("🔍 loginController:", loginController);

app.get('/', indexController.index);
app.get('/user', userController.index);
app.get('/login', loginController.index);

//Handling Errors=============================================================
app.use((req, res, next) => { // catch 404 and pass to error handler
  next(createError(404));
});

app.use((err, req, res, next) => { //handle error
  if (typeof err.array === 'function') { 
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} "${e.path}" ${e.msg}`)
      .join(', ');
    err.status = 422;
  }

  res.status(err.status || 500);

  //set local variables, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render error page
  res.render('error'); // se envía y renderiza mi fichero error.ejs
});

//============================================================================

export default app;
