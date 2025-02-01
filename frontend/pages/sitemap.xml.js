import { getSortedPostsData } from "../lib/mongodb";

const BASE_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.beatmastermind.com";

function formatDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    console.error("Invalid date:", date);
    return "2024-01-01"; // Default date
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateSiteMap(posts) {
  // Create sets to store unique categories and tags
  const uniqueCategories = new Set();
  const uniqueTags = new Set();

  // Process each post
  posts.forEach(({ slug, createdAt, blogcategory, tags }) => {
    const lastmod = createdAt ? formatDate(createdAt) : "2024-01-01";

    // Add categories and tags to the unique sets
    if (blogcategory) {
      blogcategory.forEach((category) => uniqueCategories.add(category));
    }
    if (tags) {
      tags.forEach((tag) => uniqueTags.add(tag));
    }

    // Generate blog URLs
    const blogUrl = `
        <url>
          <loc>${`${BASE_URL}/blog/${slug}`}</loc>
          <lastmod>${lastmod}</lastmod>
        </url>
      `;
  });

  // Create URL entries for unique categories
  const categoryUrls = Array.from(uniqueCategories)
    .map(
      (category) => `
      <url>
        <loc>${`${BASE_URL}/topics/${category}`}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
      </url>
    `
    )
    .join("");

  // Create URL entries for unique tags
  const tagUrls = Array.from(uniqueTags)
    .map(
      (tag) => `
      <url>
        <loc>${`${BASE_URL}/tag/${tag}`}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
      </url>
    `
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        <!-- Static URLs -->
        <url>
          <loc>${BASE_URL}</loc>
        </url>
        <url>
          <loc>${BASE_URL}/about</loc>
        </url>
        <url>
          <loc>${BASE_URL}/contact</loc>
        </url>
        <url>
          <loc>${BASE_URL}/disclaimer</loc>
        </url>
        ${posts
          .map(({ slug, createdAt }) => {
            const lastmod = createdAt ? formatDate(createdAt) : "2024-01-01";
            return `
              <url>
                <loc>${`${BASE_URL}/blog/${slug}`}</loc>
                <lastmod>${lastmod}</lastmod>
              </url>
            `;
          })
          .join("")}
        ${categoryUrls}
        ${tagUrls}
      </urlset>
    `;
}

export async function getServerSideProps({ res }) {
  try {
    const posts = await getSortedPostsData();

    const sitemap = generateSiteMap(posts);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {}
    };
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.statusCode = 500;
    res.end();
    return {
      props: {}
    };
  }
}

export default function SiteMap() {
  return null;
}
