import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}, {
    collection: 'users',    // para forzar el nombre de la colección
    versionKey: false   // para desactivar el campo '__v'
})

// método del modelo
userSchema.statics.hashPassword = (clearPassword) => {
    return bcrypt.hash(clearPassword, 7)
}

const User = mongoose.model('User', userSchema)

export default User