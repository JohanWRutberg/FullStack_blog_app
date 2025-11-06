import axios from "axios";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function CategoryPage({ initialData, tag, canonicalUrl }) {
  const [loading, setLoading] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [perPage] = useState(6); // Number of blogs per page
  const [blog, setBlog] = useState(initialData || []);
  const router = useRouter();

  const { tags } = router.query;

  useEffect(() => {
    // Function to fetch blog data
    const fetchBlogdata = async () => {
      try {
        const res = await axios.get(`/api/getblog?tags=${tags}`);
        const alldata = res.data;
        setBlog(alldata);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog data", error);
        setLoading(false);
      }
    };

    // Fetch blog data only if tags exists
    if (tags) {
      fetchBlogdata();
    } else {
      router.push("/404");
    }
  }, [tags]);

  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastblog = currentPage * perPage;
  const indexOfFirstblog = indexOfLastblog - perPage;
  const currentBlogs = blog.slice(indexOfFirstblog, indexOfFirstblog + perPage);

  const allblog = blog.length;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(allblog / perPage); i++) {
    pageNumbers.push(i);
  }

  // Filter published blogs
  const publishedblogs = currentBlogs.filter((ab) => ab.status === "publish");

  function extractFirstImageUrl(markdownContent) {
    const regex = /!\[.*?\]\((.*?)\)/;
    const match = markdownContent.match(regex);
    return match ? match[1] : null;
  }

  function removeSpecialCharacters(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  function getFirstWords(text) {
    if (!text) return "";
    const cleanedText = removeSpecialCharacters(text);
    const words = cleanedText.split(" ");
    return words.slice(0, 10).join(" ") + "...";
  }

  return (
    <>
      <Head>
        <title>
          {tag
            ? `${capitalizeFirstLetter(tag)} | Beat MasterMind`
            : "Beat MasterMind"}
        </title>
        <link
          rel="canonical"
          href={
            canonicalUrl ||
            `${
              process.env.NEXT_PUBLIC_SITE_URL ||
              "https://www.beatmastermind.com"
            }${router.asPath}`
          }
        />
        <meta name="keywords" content={tag || "Tags on Beat MasterMind"} />
        <meta
          property="og:title"
          content={tag ? capitalizeFirstLetter(tag) : "Tags on Beat MasterMind"}
        />
        <meta
          property="og:description"
          content={
            blog.description
              ? blog.description.slice(0, 150)
              : "Blog post on Beat MasterMind"
          }
        />
        <meta
          property="og:image"
          content={blog.image || "/default-image.png"}
        />
        <meta
          property="og:url"
          content={`${
            process.env.NEXT_PUBLIC_SITE_URL || "https://www.beatmastermind.com"
          }${router.asPath}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={tag ? capitalizeFirstLetter(tag) : "Tags on Beat MasterMind"}
        />
        <meta
          name="twitter:description"
          content={
            blog.description
              ? blog.description.slice(0, 150)
              : "Blog post on Beat MasterMind"
          }
        />
        <meta
          name="twitter:image"
          content={blog.image || "/default-image.png"}
        />
      </Head>
      <div className="blogpage">
        <div className="category_slug">
          <div className="container">
            <div className="category_title">
              <div className="flex gap-1">
                <h1>
                  {/* Tags: */} {loading ? <div>Loading... </div> : tag}
                </h1>
                <span>
                  {loading ? (
                    <div>0</div>
                  ) : (
                    publishedblogs.filter((blog) => blog.tags).length
                  )}
                </span>
              </div>
            </div>
            <div className="category_blogs mt-3">
              {loading ? (
                <div className="wh-100 flex flex-center mt-2 pb-5">
                  <div className="loader"></div>
                </div>
              ) : (
                publishedblogs.map((item) => {
                  const firstImageUrl = extractFirstImageUrl(item.description);
                  return (
                    <div className="cate_blog" key={item._id}>
                      <Link href={`/blog/${item.slug}`}>
                        <Image
                          src={firstImageUrl || "/img/noimage.jpg"}
                          alt={item.title}
                          height={830}
                          width={1250}
                        />
                      </Link>

                      <div className="bloginfo mt-2">
                        <Link href={`/tag/${item.tags[0]}`}>
                          <div className="blogtag">{item.tags[0]}</div>
                        </Link>
                        <Link href={`/blog/${item.slug}`}>
                          <h3>{item.title}</h3>
                        </Link>
                        <p>{getFirstWords(item.description)}</p>
                        <div className="blogauthor flex gap-1">
                          <div className="blogaimg">
                            <Image
                              src="/img/Beat_Master.PNG"
                              alt="logo"
                              height={50}
                              width={50}
                            />
                          </div>
                          <div className="flex flex-col flex-left gap-05">
                            <h4>Beat MasterMind</h4>
                            <span>
                              Updated:{" "}
                              {new Date(item.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="blogpagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {pageNumbers
                .slice(
                  Math.max(currentPage - 3, 0),
                  Math.min(currentPage + 2, pageNumbers.length)
                )
                .map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentBlogs.length < perPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Fetching data at the server side
export async function getServerSideProps(context) {
  const { tags } = context.params;
  let initialData = [];

  try {
    const res = await axios.get(
      `http://localhost:3000/api/getblog?tags=${tags}`
    );
    initialData = res.data;
  } catch (error) {
    console.error("Error fetching blog data", error);
  }

  return {
    props: {
      initialData,
      tag: tags,
      canonicalUrl: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://www.beatmastermind.com"
      }/tag/${tags}`,
    },
  };
}
