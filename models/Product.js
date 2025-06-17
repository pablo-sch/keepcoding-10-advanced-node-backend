import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: String,
    price: { type: Number },
    photo: String,
    tag: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      photo: String,
    },
  },
  {
    collection: "products", // to force the name of the collection
    versionKey: false, // to deactivate the field ‘__v’ in MongoDB
  }
);

productSchema.statics.list = async function (filter, limit, skip, sort, fields) {
  const [products, total] = await Promise.all([
    this.find(filter).populate("owner", "name").limit(limit).skip(skip).sort(sort).select(fields),
    this.countDocuments(filter),
  ]);

  return { products, total };
};

const Product = mongoose.model("Product", productSchema);

export default Product;
