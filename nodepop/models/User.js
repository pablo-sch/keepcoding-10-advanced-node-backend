import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// defining the user scheme
const userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
}, {
    collection: 'users', // to force the name of the collection
    versionKey: false // to deactivate the field ‘__v’ in MongoDB
})

// password encryption coming from my iniDB.js script
userSchema.statics.hashPassword = (clearPassword) => {
    return bcrypt.hash(clearPassword, 7)
}

// compare login password (not encrypted) with DB password (encrypted)
userSchema.methods.comparePassword = function(clearPassword) {
  return bcrypt.compare(clearPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User