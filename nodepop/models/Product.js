import mongoose, { Schema, Types } from 'mongoose'

// definir el esquema de los agentes
const productSchema = new Schema({
  name: String,
  price: { type: Types.Decimal128 },
  url: String,
  state: String,
}, {
  collection: 'products' // para forzar el nombre de la colección
})

// crear el modelo
const Product = mongoose.model('Product', productSchema)

export default Product