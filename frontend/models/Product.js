import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  asin: { type: String, unique: true },
  title: String,
  price: String,
  image: String,
  url: String,
  from: String,
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
