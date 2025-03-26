import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// definir el esquema de los usuarios
const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}, {
    collection: 'users',    // para forzar el nombre de la colección
    versionKey: false   // para desactivar el campo '__v'
})

// encriptación de la contraseña que viene de mi script iniDB.js
userSchema.statics.hashPassword = (clearPassword) => {
    return bcrypt.hash(clearPassword, 7)
}

//comparación la contraseña del login (no encriptada) con la de la BD (encriptada)
userSchema.methods.comparePassword = function(clearPassword) {
  return bcrypt.compare(clearPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User