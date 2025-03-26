//CommomJS (default) --> ES Modules--------------------------------------------------------------

// 1º Librerías de Express/Node
import createError from 'http-errors';
import express from 'express';
import path from 'path';

// 2º Librerías de Terceros
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// 3º Librerías Propias
import connectMongoose from './lib/connectMongoose.js'; 
import * as sessionManager from './lib/sessionManager.js'; 

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

//Middleware Estáticos========================================================
app.use(logger('dev')); // registra las solicitudes HTTP en la consola en formato 'dev' mediante morgan
app.use(express.json()); // procesa cuerpos de solicitudes en formato JSON, lo convierte en un objeto JavaScript accesible en 'req.body'
app.use(express.urlencoded({ extended: false })); // procesa datos de formularios HTML
app.use(cookieParser());// permite que la aplicación lea las cookies que el cliente envía con la solicitud
app.use(express.static(path.join(import.meta.dirname, 'public'))); // se usa para servir archivos estáticos como imágenes, hojas de estilo (CSS), scripts (JS), etc
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__filename, 'public')));

//Rutas de mi Aplicación======================================================
app.use(sessionManager.middleware)
app.use(sessionManager.useSessionInViews)
app.get('/', indexController.index);
app.get('/login', loginController.index);
app.post('/login', loginController.postLogin)
app.get('/logout', loginController.logout)

//app.get('/user', userController.index);


/* app.get('/login', loginController.logout)
app.get('/product/new', sessionManager.guard, productController.index)
app.post('/product/new', sessionManager.guard, productController.postNew)
app.get('/product/delete/:productId', sessionManager.guard, productController.deleteProduct) */

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

export default app;
