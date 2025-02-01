import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsAmazon } from "react-icons/bs";
import { DiCodeigniter } from "react-icons/di";
import { GiDrum, GiDrumKit } from "react-icons/gi";
import { ImHeadphones } from "react-icons/im";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { allyDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import Head from "next/head"; // Import the next/head module

function extractFirstImageUrl(markdownContent) {
  if (!markdownContent || typeof markdownContent !== "string") {
    return null;
  }
  const regex = /!\[.*?\]\((.*?)\)/;
  const match = markdownContent.match(regex);
  return match ? match[1] : null;
}

// Fetch the blog data on the server side
export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    // Fetch the specific blog post based on the slug
    const res = await axios.get(`${process.env.NEXT_WEBSITE_URL}/api/getblog?slug=${slug}`);
    const alldata = res.data;

    if (!alldata || alldata.length === 0) {
      // If no blog found, return notFound to show 404 page
      return { notFound: true };
    }

    const firstImageUrl = extractFirstImageUrl(alldata[0].description);
    const blog = { ...alldata[0], image: firstImageUrl };

    // Fetch all blog posts for backlinks
    const resAllBlogs = await axios.get(`${process.env.NEXT_WEBSITE_URL}/api/getblog`);
    const blogPosts = resAllBlogs.data;
    const blogPostLinks = blogPosts.map((post) => ({
      href: `/blog/${post.slug}`,
      alt: post.title,
      image: extractFirstImageUrl(post.description),
      status: post.status,
      createdAt: post.createdAt
    }));

    return {
      props: {
        blog,
        blogPostLinks
      }
    };
  } catch (error) {
    console.error("Error fetching blog", error);
    return { notFound: true };
  }
}

export default function BlogPage({ blog = {}, blogPostLinks = [] }) {
  const router = useRouter();

  // Handle the loading state if the page is not yet generated
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // Function to calculate reading time
  function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  const readingTime = blog.description ? calculateReadingTime(blog.description) : 1;

  // Collect Amazon affiliate links
  const [linkDetails, setLinkDetails] = useState([]);
  useEffect(() => {
    if (blog.description) {
      const links = document.querySelectorAll(".observed-link");
      const details = Array.from(links)
        .map((link) => ({
          alt: link.getAttribute("alt") || link.href,
          href: link.href
        }))
        .filter((link) => link.href.includes("https://amzn"));
      setLinkDetails(details);
    }
  }, [blog]);

  // Markdown code highlighter
  const Code = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");

    const [copied, setCopied] = useState(false);
    // Copy code function
    const handleCopy = () => {
      navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000); // 3 seconds
    };

    if (inline) {
      return <code>{children}</code>;
    } else if (match) {
      return (
        <div style={{ position: "relative" }}>
          <SyntaxHighlighter
            style={allyDark}
            language={match[1]}
            PreTag="pre"
            {...props}
            codeTagProps={{
              style: {
                padding: "0",
                borderRadius: "5px",
                overflowX: "auto",
                whiteSpace: "pre-wrap"
              }
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
          <button
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              zIndex: "1",
              background: "#3d3d3d",
              color: "#fff",
              padding: "10px"
            }}
            onClick={handleCopy}
          >
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
      );
    } else {
      return (
        <code className="md-post-code" {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <>
      <Head key={router.asPath}>
        <title>{`${blog.title || "Blog Post"} | Beat MasterMind`}</title>
        <meta
          name="description"
          content={
            blog.description
              ? blog.description.slice(0, 150)
              : "Stay updated with the latest tips, tricks, and news on electronic drums and accessories. Dive into the Beat Mastermind blog for expert advice."
          }
        />
        <meta name="keywords" content={blog.title || "Blog post"} />
        <meta property="og:title" content={blog.title || "Blog Post"} />
        <meta
          property="og:description"
          content={blog.description ? blog.description.slice(0, 150) : "Blog post on Beat MasterMind"}
        />
        <meta property="og:image" content={blog.image || "/default-image.png"} />
        <meta property="og:url" content={`https://www.beatmastermind.com${router.asPath}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title || "Blog Post"} />
        <meta
          name="twitter:description"
          content={blog.description ? blog.description.slice(0, 150) : "Blog post on Beat MasterMind"}
        />
        <meta name="twitter:image" content={blog.image || "/default-image.png"} />
      </Head>

      <div className="slugpage">
        <div className="container">
          <div className="topslug_titles">
            <h1 className="slugtitle">{blog.title || "Untitled Post"}</h1>
            <h5>
              By <span>Beat MasterMind</span>.{" "}
              {blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })
                : "Unknown Date"}{" "}
              - <span>{readingTime} min read</span>
            </h5>
          </div>

          <div className="flex flex-sb flex-left pb-5 flex-wrap">
            <div className="leftblog_data_markdown">
              <div className="w-100 blogcontent">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => {
                      const isAmazonLink = href.startsWith("https://amzn");
                      return (
                        <a
                          href={href}
                          className={`observed-link ${isAmazonLink ? "amazon-link" : ""}`}
                          alt={children}
                          target={isAmazonLink ? "_blank" : "_self"}
                          rel={isAmazonLink ? "noopener noreferrer" : undefined}
                        >
                          {isAmazonLink && (
                            <span className="st_icon_amazon">
                              <BsAmazon />
                            </span>
                          )}
                          {children}
                        </a>
                      );
                    },
                    code: Code
                  }}
                >
                  {blog.description}
                </ReactMarkdown>
              </div>
            </div>
            <div className="rightslug_data">
              <div className="slug_profile_info">
                <div className="slugprofile_sec">
                  <div className="slug_aff_img">
                    <Image
                      src="/img/vecteezy_amazon-logo-png-amazon-icon-transparent-png_19766240.png"
                      alt="brand"
                      width={300}
                      height={150}
                    />

                    <br />
                    <h5>Buy the products featured in blog post</h5>
                    <br />
                  </div>
                </div>
                <div className="aff_container">
                  <div className="aff_img">
                    <ul>
                      {linkDetails.map((link, index) => (
                        <li key={index}>
                          <Link href={link.href} legacyBehavior>
                            <a className="flex flex-left" target="_blank" rel="noopener noreferrer">
                              <div className="social_talks">
                                <div className="st_icon_amazon">
                                  <BsAmazon />
                                </div>
                              </div>
                              <span className="link-alt">{link.alt}</span>
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="slug_aff_img mt-15">
                  <p>
                    As an Amazon Associate, we earn from qualifying purchases. This means that if you click on a link to
                    an Amazon product on this site and make a purchase, we may receive a commission at no additional
                    cost to you. This helps support the site and allows us to continue providing useful content.
                    <br />
                    <br />
                    Thank you for your support!
                  </p>
                </div>
              </div>
              <div className="topics_sec">
                <h2>Latest Blog Posts</h2>
                <div className="slug_blog_links">
                  <br />
                  <div className="aff_container">
                    <div className="aff_img">
                      <ul>
                        {blogPostLinks
                          .filter((link) => link.status === "publish")
                          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                          .slice(0, 5)
                          .map((link, index) => (
                            <li key={index}>
                              <Link href={link.href} legacyBehavior>
                                <a className="flex flex-left">
                                  <div className="social_talks">
                                    <div className="st_icon_blog">
                                      <Image
                                        src={link.image || "/img/noimage.jpg"}
                                        alt={link.alt}
                                        width={100}
                                        height={100}
                                      />
                                    </div>
                                  </div>
                                  <span className="blog-link-alt">{link.alt}</span>
                                </a>
                              </Link>
                            </li>
                          ))}
                        <li className="">
                          <Link href="/">All blog posts</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Topics section */}
              <div className="topics_sec">
                <h2>Topics</h2>
                <div className="topics_list">
                  <Link href="/topics/drumsets">
                    <div className="topics">
                      <div className="flex flex-center topics_svg">
                        <GiDrumKit />
                      </div>
                      <h3>Drum Sets</h3>
                    </div>
                  </Link>
                  <Link href="/topics/accessories">
                    <div className="topics">
                      <div className="flex flex-center topics_svg">
                        <GiDrum />
                      </div>
                      <h3>Accessories</h3>
                    </div>
                  </Link>
                  <Link href="/topics/sound">
                    <div className="topics">
                      <div className="flex flex-center topics_svg">
                        <ImHeadphones />
                      </div>
                      <h3>Sound</h3>
                    </div>
                  </Link>
                  <Link href="/topics/hot">
                    <div className="topics">
                      <div className="flex flex-center topics_svg">
                        <DiCodeigniter />
                      </div>
                      <h3>Hot topics</h3>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: If you have client-side navigation and want to ensure meta tags update */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          if (typeof window !== "undefined") {
            window.history.pushState({}, '', '${router.asPath}');
          }
        `
        }}
      />
    </>
  );
}
