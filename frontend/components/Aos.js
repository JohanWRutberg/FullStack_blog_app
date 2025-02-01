import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Aos({ children }) {
  useEffect(() => {
    AOS.init({
      // Global setting for aos animation
      duration: 1000, // Duration of animation 1 second
      offset: 200, // Offset of animation (in px) from the original trigger point
      easing: "ease", // Default easing for aos animation
      once: true // Whether animation should happen only once - while scrolling
    });
  }, []);
  return <div>{children}</div>;
}
