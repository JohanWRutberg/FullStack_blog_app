import useFetchData from "@/hooks/useFetchData";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { GiDrumKit } from "react-icons/gi";
import { GiDrum } from "react-icons/gi";
import { RiSoundModuleFill } from "react-icons/ri";
import { FaHotjar } from "react-icons/fa";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [perPage] = useState(8); // Number of blogs per page

  const { alldata, loading } = useFetchData("/api/getblog");

  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastblog = currentPage * perPage;
  const indexOfFirstblog = indexOfLastblog - perPage;
  const currentBlogs = alldata.slice(indexOfFirstblog, indexOfLastblog);

  const allblog = alldata.length;

  // Filter published blogs from all blogs
  const publishedblogs = alldata.filter((ab) => ab.status === "publish");

  const totalPublishedBlogs = publishedblogs.length;

  // Paginate based on published blogs count
  const totalPages = Math.ceil(totalPublishedBlogs / perPage);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  function extractFirstImageUrl(markdownContent) {
    if (!markdownContent || typeof markdownContent !== "string") {
      return null;
    }
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
    return words.slice(0, 30).join(" ") + "...";
  }

  return (
    <>
      <Head>
        <title>Beat MasterMind</title>
        <meta name="description" content="Beat Master Mind - Blog about Electronic drums and accessories!" />
        {/* Facebook Meta Tags */}
        <meta property="og:url" content="https://www.beatmastermind.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Beat MasterMind Blog" />
        <meta property="og:description" content="Beat Master Mind - Blog about Electronic drums and accessories!" />
        <meta property="og:image" content="https://beatmastermind.comnull" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="beatmastermind.com" />
        <meta property="twitter:url" content="https://www.beatmastermind.com/" />
        <meta name="twitter:title" content="Beat Master Mind" />
        <meta name="twitter:description" content="Beat Master Mind - Blog about Electronic drums and accessories!" />
        <meta name="twitter:image" content="https://beatmastermind.comnull"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: "Beat MasterMind Video",
            description: "An introduction to Beat MasterMind - Your electronic drums expert.",
            thumbnailUrl: "https://www.beatmastermind.com/video_thumbnail.jpg",
            uploadDate: "2023-12-31T12:00:00+00:00", // Update with actual date
            contentUrl: "https://www.beatmastermind.com/Beat_MasterMind.mp4",
            embedUrl: "https://www.beatmastermind.com", // URL of the page where the video is embedded
            publisher: {
              "@type": "Organization",
              name: "Beat MasterMind",
              logo: {
                "@type": "ImageObject",
                url: "https://www.beatmastermind.com/favicon.png"
              }
            }
          })}
        </script>
      </Head>

      <section className="header_data_section">
        <video autoPlay loop muted playsInline className="background-video opacity-90">
          <source src="/Beat_MasterMind.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Add a fallback image for the video */}
        <img
          src="/video_thumbnail.jpg"
          alt="Beat MasterMind video thumbnail"
          style={{ display: "none" }} // Hide the image for users, but keep it for crawlers
        />
        <div className="header-container flex flex-sb w-100">
          <div className="leftheader_info">
            <h1 data-aos="fade-right">
              Beat <span>MasterMind</span>.
              <br />
            </h1>
            <h3 data-aos="fade-right">Your electronic drums expert</h3>
            <div className="flex gap-2">
              <Link href="/contact">
                <button>Contact</button>
              </Link>
              <Link href="/about">
                <button>About</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="main_blog_section">
        <div className="container flex flex-sb flex-left flex-wrap">
          <div className="leftblog_sec">
            <h2>Recently Published</h2>
            <div className="blogs_sec">
              {loading ? (
                <div className="wh-100 flex flex-center mt-2 pb-5">
                  <div className="loader"></div>
                </div>
              ) : (
                <>
                  {publishedblogs.slice(indexOfFirstblog, indexOfLastblog).map((blog) => {
                    const firstImageUrl = extractFirstImageUrl(blog.description);
                    return (
                      <div className="blog flex" key={blog._id}>
                        <div className="blogimg">
                          <Link href={`/blog/${blog.slug}`}>
                            <Image
                              src={firstImageUrl || "/img/noimage.jpg"}
                              alt={blog.title}
                              width={800}
                              height={600}
                            />
                          </Link>
                        </div>
                        <div className="bloginfo">
                          <Link href={`/tag/${blog.tags[0]}`}>
                            <div className="blogtag">{blog.tags[0]}</div>
                          </Link>
                          <Link href={`/blog/${blog.slug}`}>
                            <h3>{blog.title}</h3>
                          </Link>
                          <p>{getFirstWords(blog.description)}</p>
                          <div className="blogauthor flex gap-1">
                            <div className="blogaimg">
                              <img src="/img/Beat_Master.PNG" alt="logo" />
                            </div>
                            <div className="flex flex-col flex-left gap-05">
                              <h4>Beat Master Mind</h4>
                              <span>
                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Pagination */}
            <div className="blogpagination">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {pageNumbers.map((number) => (
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
                disabled={currentPage === totalPages || publishedblogs.length < perPage}
              >
                Next
              </button>
            </div>
          </div>
          <div className="rightblog_info">
            <div className="topics_sec">
              <h2>Topics</h2>
              <div className="topics_list">
                <Link href="/topics/drumsets">
                  <div className="topics">
                    <div className="flex flex-center topics_svg">
                      <GiDrumKit />
                    </div>
                    <h3>Drum sets</h3>
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
                      <RiSoundModuleFill />
                    </div>
                    <h3>Sound</h3>
                  </div>
                </Link>
                <Link href="/topics/hot">
                  <div className="topics">
                    <div className="flex flex-center topics_svg">
                      <FaHotjar />
                    </div>
                    <h3>Hot topics</h3>
                  </div>
                </Link>

                {/* Add other topics */}
              </div>
            </div>
            <div className="tags_sec mt-3">
              <h2>Tags</h2>
              <div className="tags_list">
                <Link href="/tag/alesis">#Alesis</Link>
                <Link href="/tag/audio">#Audio</Link>
                <Link href="/tag/beat">#Beat</Link>
                <Link href="/tag/comparison">#Comparison</Link>
                <Link href="/tag/controller">#Controller</Link>
                <Link href="/tag/cymbals">#Cymbals</Link>
                <Link href="/tag/donner">#Donner</Link>
                <Link href="/tag/drumkit">#Drumkit</Link>
                <Link href="/tag/drums">#Drums</Link>
                <Link href="/tag/drumsticks">#Drumsticks</Link>
                <Link href="/tag/edrums">#Edrums</Link>
                <Link href="/tag/electronic">#Electronic</Link>
                <Link href="/tag/hardware">#Hardware</Link>
                <Link href="/tag/kids">#Kids</Link>
                <Link href="/tag/kits">#Kits</Link>
                <Link href="/tag/pads">#Pads</Link>
                <Link href="/tag/practice">#Practice</Link>
                <Link href="/tag/pro">#Pro</Link>
                <Link href="/tag/rhythm">#Rhythm</Link>
                <Link href="/tag/roland">#Roland</Link>
                <Link href="/tag/sets">#Sets</Link>
                <Link href="/tag/simmons">#Simmons</Link>
                <Link href="/tag/sound">#Sound</Link>
                <Link href="/tag/strike">#Strike</Link>
                <Link href="/tag/yamaha">#Yamaha</Link>

                {/* Add other tags */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
