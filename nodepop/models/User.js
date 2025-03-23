import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})

// método del modelo
userSchema.statics.hashPassword = (clearPassword) => {
    return bcrypt.hash(clearPassword, 7)
}

const User = mongoose.model('User', userSchema)

export default User