import mongoose, { Schema } from 'mongoose'

// defining the product scheme
const productSchema = new Schema({
  name: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  price: { type: Number },
  photo: String,
}, {
  collection: 'products', // to force the name of the collection
  versionKey: false // to deactivate the field ‘__v’ in MongoDB
})

const Product = mongoose.model('Product', productSchema)

export default Product