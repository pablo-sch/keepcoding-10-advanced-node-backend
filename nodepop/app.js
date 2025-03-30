//CommomJS (default) --> ES Modules--------------------------------------------------------------

// 1st Express/Node libraries
import createError from 'http-errors';
import express from 'express';
import path from 'path';

// 2nd Third-party libraries
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// 3rd Own libraries
import connectMongoose from './lib/connectMongoose.js'; 
import * as sessionManager from './lib/sessionManager.js'; 

import * as indexController from './src/controllers/indexController.js';
import * as loginController from './src/controllers/loginController.js';
import { upload } from './src/middleware/multerConfig.js';


//Connect to MongoDB=========================================================
await connectMongoose();

const app = express();

//Configuring the view engine=================================================
app.set('views', 'views');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Global Parameters===========================================================
app.locals.appName = 'NodePoP';// --> any variable with the name ‘appName’ in my .ejs will be named ‘NodePoP’.

//Static Middleware===========================================================
app.use(logger('dev')); // logs HTTP requests to the console in ‘dev’ format via morgan
app.use(express.json()); // processes request bodies in JSON format, converts it into a JavaScript object accessible in ‘req.body’
app.use(express.urlencoded({ extended: false })); // processes data from HTML forms
app.use(cookieParser());// allows the application to read the cookies that the client sends with the request
app.use(express.static(path.join(import.meta.dirname, 'public'))); // used to serve static files such as images, style sheets (CSS), scripts (JS), etc.
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__filename, 'public')));

//My Application Routes=======================================================
app.use(sessionManager.middleware)
app.use(sessionManager.useSessionInViews)

app.get('/', indexController.index);
app.get('/login', loginController.index);
app.get('/logout', loginController.logout)
app.get('/delete/:productId', sessionManager.guard, indexController.deleteProduct)

app.post('/login', loginController.postLogin)
app.post('/new_product', upload.single('photo'), sessionManager.guard, indexController.postNew)

//Handling Errors=============================================================
app.use((req, res, next) => { // catch 404 and pass to error handler
  next(createError(404));
});

app.use((err, req, res) => { //handle error
  if (typeof err.array === 'function') { 
    err.message = 'Invalid request: ' + err.array()
      .map(e => `${e.location} ${e.type} "${e.path}" ${e.msg}`).join(', ');
    err.status = 422;
  }

  res.status(err.status || 500);

  //set local variables, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //render error page
  res.render('error'); // my error.ejs file is sent and rendered
});

export default app;
