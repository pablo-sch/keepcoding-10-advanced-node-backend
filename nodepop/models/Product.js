import mongoose, { Schema } from 'mongoose'

// definir el esquema de los productos
const productSchema = new Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  price: { type: Number },
  photo: String,
}, {
  collection: 'products', // para forzar el nombre de la colección
  versionKey: false // para desactivar el campo '__v'
})

// crear el modelo
const Product = mongoose.model('Product', productSchema)

export default Product