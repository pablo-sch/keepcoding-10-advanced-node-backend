import session from 'express-session'
import MongoStore from 'connect-mongo'

const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2

//Middleware para gestionar sesiones=======================================================================
export const middleware = session({
  // este middleware se encarga de gestionar las sesiones

  name: 'nodeapp-session',
  // nombre de la cookie donde se almacenará la sesión en el navegador del usuario

  secret: 'jz9)^2tC3r/:+hGYm$cNLZB&A-6n5Q#gf=K?P',
  // secreto utilizado para firmar la sesión y protegerla contra manipulaciones

  saveUninitialized: true,
  // crea una sesión para cada usuario aunque no haya iniciado sesión (una sesión vacía)

  resave: false,
  // evita guardar la sesión en cada solicitud si no ha sido modificada, reduciendo la carga en la base de datos

  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },
  // define el tiempo de vida de la cookie
  store: MongoStore.create({
    // usa MongoDB para almacenar sesiones en lugar de la memoria del servidor

    mongoUrl: 'mongodb://localhost/cursonode'
    // especifica la conexión con la base de datos MongoDB
  })
})

//Middleware para pasar la sesión a las vistas=============================================================
export function useSessionInViews(req, res, next) {
  // este middleware hace que la sesión esté disponible en todas las vistas (templates).

  res.locals.session = req.session
  // asigna la sesión del usuario a una variable accesible en las vistas, lo que permite utilizar datos de sesión en el frontend

  next()
}

//Middleware de protección de rutas========================================================================
export function guard(req, res, next) {
  // este middleware protege rutas que requieren autenticación

  if (!req.session.userId) {
    res.redirect(`/login?redir=${req.url}`)
    // si el usuario no tiene req.session.userId, lo redirige a la página de login, pasando como parámetro redir la URL actual

    return
  }
  next()
}