import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
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
    collection: "posts", // to force the name of the collection
    versionKey: false, // to deactivate the field ‘__v’ in MongoDB
  }
);

postSchema.statics.list = async function (filter, limit, skip, sort, fields) {
  const [posts, total] = await Promise.all([
    this.find(filter).populate("owner", "name").limit(limit).skip(skip).sort(sort).select(fields),
    this.countDocuments(filter),
  ]);

  return { posts, total };
};

const Post = mongoose.model("Post", postSchema);
export default Post;
