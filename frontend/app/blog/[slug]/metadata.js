export async function generateMetadata({ params }) {
  const { slug } = params;

  // Hämta blogdata från API eller databas (server-side)
  const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/getblog?slug=${slug}`);
  const data = await res.json();
  const blogData = data[0];

  if (blogData) {
    return {
      title: blogData.title,
      description: blogData.description.slice(0, 150),
      openGraph: {
        title: blogData.title,
        description: blogData.description.slice(0, 150),
        image: blogData.image || "/default-image.png",
        url: `https://www.beatmastermind.com/blog/${slug}`
      },
      twitter: {
        card: "summary_large_image",
        title: blogData.title,
        description: blogData.description.slice(0, 150),
        image: blogData.image || "/default-image.png"
      }
    };
  }

  return {
    title: "Default Title",
    description: "Default description for the blog",
    openGraph: {
      title: "Default Title",
      description: "Default description for the blog",
      image: "/default-image.png",
      url: `https://www.beatmastermind.com/blog/${slug}`
    },
    twitter: {
      card: "summary_large_image",
      title: "Default Title",
      description: "Default description for the blog",
      image: "/default-image.png"
    }
  };
}
