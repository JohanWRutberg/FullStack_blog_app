import { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    asin: { type: String, required: true, unique: true },
    title: { type: String },
    price: { type: String },
    image: { type: String },
    url: { type: String },
    lastFetched: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
