import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

export default function ScrollToTopBtn() {
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to the top of page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Show or hide the button based on scroll position
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Add scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <button className={`scrollToTop ${isVisible ? "show" : "hide"}`} onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </>
  );
}
