import { Blog } from "@/models/blog";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  await mongooseConnect();

  // Fetch all blog slugs, tags, and categories
  const blogs = await Blog.find({}, { slug: 1, tags: 1, blogcategory: 1, createdAt: 1 });

  // Base URL for your site
  const baseUrl = "https://www.beatmastermind.com";

  // URLs to include in sitemap with `lastmod`
  const staticPaths = [
    { url: `${baseUrl}/`, lastmod: new Date() },
    { url: `${baseUrl}/blog/`, lastmod: new Date() },
    { url: `${baseUrl}/tag/`, lastmod: new Date() },
    { url: `${baseUrl}/topics/`, lastmod: new Date() },
    { url: `${baseUrl}/contact`, lastmod: new Date() },
    { url: `${baseUrl}/disclaimer`, lastmod: new Date() },
    { url: `${baseUrl}/about`, lastmod: new Date() }
  ];

  // Dynamically generate blog URLs with `lastmod`
  const blogPaths = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastmod: blog.createdAt || new Date()
  }));

  // Collect all unique tags
  const tags = [...new Set(blogs.flatMap((blog) => blog.tags))];

  // Collect all unique categories
  const categories = [...new Set(blogs.flatMap((blog) => blog.blogcategory))];

  // Dynamically generate tag URLs with `lastmod`
  const tagPaths = tags.map((tag) => ({
    url: `${baseUrl}/tag/${tag}`,
    lastmod: new Date()
  }));

  // Dynamically generate category URLs with `lastmod`
  const categoryPaths = categories.map((category) => ({
    url: `${baseUrl}/topics/${category}`,
    lastmod: new Date()
  }));

  // Combine all paths
  const allPaths = [...staticPaths, ...blogPaths, ...tagPaths, ...categoryPaths];

  // Generate XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPaths
    .map(({ url, lastmod }) => {
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod.toISOString().split("T")[0]}</lastmod>
    </url>
  `;
    })
    .join("")}
</urlset>`;

  // Set response content type
  res.setHeader("Content-Type", "text/xml");

  // Send the sitemap content
  res.status(200).send(sitemap);
}
