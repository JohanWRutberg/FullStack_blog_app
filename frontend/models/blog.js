const { Schema, models, model } = require("mongoose");

const BlogSchema = new Schema(
  {
    title: { type: String },
    slug: { type: String, required: true },
    description: { type: String },
    blogcategory: [{ type: String }], // Markdown content
    tags: [{ type: String }],
    status: { type: String },
    asins: [{ type: String }],
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema, "blogtest");
