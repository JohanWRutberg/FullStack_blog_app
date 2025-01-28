"use client";
import Link from "next/link";
import { IoSearchSharp, IoMoonSharp, IoSearch } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { HiBars3BottomRight } from "react-icons/hi2";
import { LuSun } from "react-icons/lu";
import { useEffect, useState } from "react";
import useFetchData from "@/hooks/useFetchData";
import Image from "next/image";

export default function Header() {
  // Searchbar open and close function
  const [searchopen, setSearchopen] = useState(false);

  // For open searchbar
  const openSearch = () => {
    setSearchopen(!searchopen);
  };

  // For close searchbar
  const closeSearch = () => {
    setSearchopen(false);
  };

  // Asidebar for mobile device
  const [aside, setAside] = useState(false);

  const asideOpen = () => {
    setAside(true);
  };

  const asideClose = () => {
    setAside(false);
  };

  // For mobile device close aside menu when click on link also
  const handleLinkClick = () => {
    setAside(false);
  };

  // Darkmode on/off
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage for darkmode preference on initial load
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    // Apply dark mode styles when darkmode state changes
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", true);
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", false);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode); // Toggle dark mode status
  };

  // Search data fetch
  const { alldata, loading } = useFetchData("/api/getblog");

  function removeSpecialCharacters(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, "");
  }

  function getFirstWords(text) {
    if (!text) return "";
    const cleanedText = removeSpecialCharacters(text);
    const words = cleanedText.split(" ");
    return words.slice(0, 10).join(" ") + "...";
  }

  // Filtering published blogs
  const publishedblogs = alldata.filter((ab) => ab.status === "publish");

  const [searchQuery, setSearchQuery] = useState("");
  // Filtering based on search query, search data from title
  const filteredBlogs =
    searchQuery.trim() === ""
      ? publishedblogs
      : publishedblogs.filter((blog) => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="header_sec">
        <div className="container header">
          <div className="header_logo">
            <Link href="/">
              <Image src="/img/Logo/BeatMaster_3.PNG" alt="logo" width={100} height={100} />
            </Link>
          </div>
          <div className="searchbar">
            <IoSearchSharp />
            <input
              onClick={openSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Discover our blog articles..."
            />
          </div>

          <div className="nav_list_dark">
            <ul>
              <li>
                <Link className="nav_list_link" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="nav_list_link" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="nav_list_link" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
            {/* For mobile devices */}
            <div className="navlist_mobile_ul">
              <button onClick={toggleDarkMode}>{darkMode ? <IoMoonSharp /> : <LuSun />}</button>
              <button onClick={openSearch}>
                <IoSearch />
              </button>
              <button onClick={asideOpen}>
                <HiBars3BottomRight />
              </button>
            </div>
            <div className="darkmode">
              <label className="switch">
                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                <span className="slider_header"></span>
              </label>
            </div>
          </div>
        </div>
        <div className={`search_click ${searchopen ? "open" : ""}`}>
          <div className="searchab_input">
            <IoSearchSharp />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Discover our blog articles..."
            />
          </div>
          <div className="search_data text-start">
            {loading ? (
              <div className="wh-100 flex flex-center mt-2 pb-5">
                <div className="loader"></div>
              </div>
            ) : (
              <>
                {searchQuery ? (
                  <>
                    {filteredBlogs.slice(0, 3).map((blog) => {
                      return (
                        <Link onClick={closeSearch} className="blog" key={blog._id} href={`/blog/${blog.slug}`}>
                          <div className="bloginfo">
                            <div>
                              <h3>{blog.slug}</h3>
                            </div>
                            <p>{getFirstWords(blog.description)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  <div>No Search Result</div>
                )}
              </>
            )}
          </div>
          <div className="exit_search" onClick={closeSearch}>
            <div>
              <FaXmark />
            </div>
            <h4>ESC</h4>
          </div>
        </div>

        {/* Mobile navlist */}
        <div className={aside ? `navlist_mobile open` : "navlist_mobile"}>
          <div className="navlist_m_title flex flex-sb">
            <h2 className="mt-1 text-xl text-[#667EEA]">Beat MasterMind Blog</h2>
            <button onClick={asideClose}>
              <FaXmark />
            </button>
          </div>
          <hr />
          <h3 className="mt-2 text-xl text-[#667EEA]">Main Menu</h3>
          <ul onClick={handleLinkClick}>
            <li>
              <Link href="/" className="text-md hover:text-[#667EEA]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-md hover:text-[#667EEA]">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-md hover:text-[#667EEA]">
                Contact
              </Link>
            </li>
          </ul>
          <hr />
          <h3 className="mt-2 text-xl text-[#667EEA]">Topics</h3>
          <ul onClick={handleLinkClick}>
            <li>
              <Link href="/topics/drumsets" className="text-md hover:text-[#667EEA]">
                Drum Sets
              </Link>
            </li>
            <li>
              <Link href="/topics/accessories" className="text-md hover:text-[#667EEA]">
                Accessories
              </Link>
            </li>
            <li>
              <Link href="/topics/sound" className="text-md hover:text-[#667EEA]">
                Sound
              </Link>
            </li>
            <li>
              <Link href="/topics/hot" className="text-md hover:text-[#667EEA]">
                Hot Topics
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
