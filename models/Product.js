import mongoose, { Schema } from 'mongoose'

// defining the product scheme
const productSchema = new Schema({
  name: String,
  price: { type: Number },
  photo: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },

}, {
  collection: 'products', // to force the name of the collection
  versionKey: false // to deactivate the field ‘__v’ in MongoDB
})

const Product = mongoose.model('Product', productSchema)

export default Product