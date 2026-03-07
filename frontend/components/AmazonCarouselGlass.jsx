// components/AmazonCarouselGlass.jsx
"use client";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

/**
 * Robust AmazonCarouselGlass
 * Props:
 *  - asins: array of ASINs (used to fetch products inside component or passed products)
 *
 * Behavior:
 *  - duplicates items for seamless loop
 *  - waits until images loaded OR ResizeObserver shows scrollable area
 *  - starts rAF loop only when ready
 *  - pauses on hover / pointerdown; resumes on pointerup / leave
 */

export default function AmazonCarouselGlass({ asins = [] }) {
  const [products, setProducts] = useState([]); // fetched products
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const startedRef = useRef(false);
  const loopWidthRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const uniqueCountRef = useRef(0);
  const obsRef = useRef(null);

  // SPEED: responsive (px per frame baseline scaled by dt)
  function getBaseSpeed() {
    if (typeof window === "undefined") return 0.3;
    return window.innerWidth < 768 ? 0.16 : 0.36;
  }

  // 1) Fetch product data for given ASINs
  useEffect(() => {
    let active = true;
    if (!asins || asins.length === 0) {
      setProducts([]);
      return;
    }

    async function load() {
      const arr = [];
      for (const asin of asins) {
        try {
          const res = await fetch("/api/amazon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ asin }),
          });
          const data = await res.json();
          // Ensure shape
          arr.push({
            asin,
            title:
              data?.title ||
              data?.ItemInfo?.Title?.DisplayValue ||
              "Unknown product",
            price:
              data?.price ||
              (data?.Offers
                ? data.Offers.Listings?.[0]?.Price?.DisplayAmount
                : "N/A"),
            image:
              data?.image ||
              data?.Images?.Primary?.Large?.URL ||
              "/img/noimage.jpg",
            url:
              data?.url ||
              `https://www.amazon.com/dp/${asin}?tag=${process.env.NEXT_PUBLIC_AFFILIATE_TAG}`,
            from: data?.from || "api",
          });
        } catch (e) {
          arr.push({
            asin,
            title: "Unknown product",
            price: "N/A",
            image: "/img/noimage.jpg",
            url: "#",
            from: "fallback",
          });
        }
      }
      if (active) {
        setProducts(arr);
        // unique count = number of unique product cards BEFORE duplication
        uniqueCountRef.current = arr.length;
        setImagesLoaded(0);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [asins]);

  // 2) Duplicate items for seamless loop
  const items = products.length ? [...products, ...products] : [];

  // 3) image load handler increments count
  function handleImageLoad() {
    setImagesLoaded((n) => n + 1);
  }

  // 4) Start autoscroll when either:
  //    - imagesLoaded >= uniqueCount
  //    - OR ResizeObserver shows scrollWidth > clientWidth
  useEffect(() => {
    const el = containerRef.current;
    if (!el || items.length === 0) return;

    function startIfScrollable() {
      if (startedRef.current) return;
      // if images loaded enough
      if (
        uniqueCountRef.current > 0 &&
        imagesLoaded >= uniqueCountRef.current
      ) {
        // small timeout to ensure layout settled
        setTimeout(() => {
          if (!startedRef.current && el.scrollWidth > el.clientWidth + 1) {
            startLoop();
            startedRef.current = true;
            // disconnect observer if any
            if (obsRef.current) {
              obsRef.current.disconnect();
              obsRef.current = null;
            }
          }
        }, 60);
        return;
      }

      // fallback: use ResizeObserver to detect when content becomes scrollable
      if (!obsRef.current && typeof ResizeObserver !== "undefined") {
        obsRef.current = new ResizeObserver(() => {
          // start when scrollable
          if (el.scrollWidth > el.clientWidth + 1) {
            if (!startedRef.current) {
              startLoop();
              startedRef.current = true;
            }
            if (obsRef.current) {
              obsRef.current.disconnect();
              obsRef.current = null;
            }
          }
        });
        obsRef.current.observe(el);
      }
    }

    // reset scrollLeft to 0 for consistent start
    el.scrollLeft = 0;
    startIfScrollable();

    // cleanup
    return () => {
      if (obsRef.current) {
        obsRef.current.disconnect();
        obsRef.current = null;
      }
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, imagesLoaded]);

  // 5) autoscroll loop using rAF
  function startLoop() {
    const el = containerRef.current;
    if (!el) return;

    let lastTime = null;
    const baseSpeed = getBaseSpeed();

    function step(time) {
      if (!el) return;
      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      if (!pausedRef.current) {
        // px to move this frame (normalize dt to 60fps baseline)
        const px = baseSpeed * (dt / (1000 / 60));
        el.scrollLeft += px;

        // measure exact width of first unique block
        if (!loopWidthRef.current) {
          const children = el.children;
          let w = 0;

          // measure exactly the uniqueCount first items
          for (let i = 0; i < uniqueCountRef.current; i++) {
            const child = children[i];
            if (!child) continue;
            const style = getComputedStyle(child);
            const marginRight = parseFloat(style.marginRight) || 0;
            w += child.offsetWidth + marginRight;
          }

          loopWidthRef.current = w;
        }

        // seamless loop reset
        if (el.scrollLeft >= loopWidthRef.current) {
          el.scrollLeft = el.scrollLeft - loopWidthRef.current;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    // if already animating - cancel first
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
    // Debug log: remove later
    // console.log("AmazonCarouselGlass AUTOSCROLL START");
  }

  // 6) Pause/resume handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleEnter = () => (pausedRef.current = true);
    const handleLeave = () => (pausedRef.current = false);
    const handlePointerDown = () => (pausedRef.current = true);
    const handlePointerUp = () => {
      setTimeout(() => {
        pausedRef.current = false;
      }, 250);
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  // Render nothing if no items
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 w-full">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Featured Products
      </h2>

      <div
        ref={containerRef}
        className="carousel flex flex-nowrap gap-6 overflow-x-auto no-scrollbar pb-4"
        tabIndex={-1}
        role="list"
        aria-label="Featured products carousel"
      >
        {items.map((p, i) => {
          const img =
            p.image && p.image.startsWith("http")
              ? p.image
              : p.image || "/img/noimage.jpg";
          return (
            <a
              key={(p.asin || i) + "-" + i}
              href={p.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 w-64 p-5 rounded-3xl bg-gradient-to-br from-black/40 via-black/20 to-black/10 backdrop-blur-xl border border-white/10 shadow-[0_8px_35px_rgba(0,0,0,0.55)] relative overflow-hidden"
              role="listitem"
              tabIndex={-1}
            >
              <div className="absolute inset-0 bg-gradient-to-tl from-white/10 to-white/5 opacity-30 pointer-events-none" />

              <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden flex items-center justify-center">
                {/* Use explicit width/height to avoid Next.js fill/sizes warning */}
                <Image
                  src={img}
                  alt={p.title}
                  width={160}
                  height={140}
                  className="object-contain drop-shadow-xl"
                  onLoad={handleImageLoad}
                />
              </div>

              <h3 className="text-white font-semibold text-sm line-clamp-2 min-h-[40px]">
                {p.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2">{p.price}</p>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 w-full text-center py-2 rounded-xl bg-white/10 text-white text-sm border border-white/10 hover:bg-white/20 transition"
                onClick={(e) => {
                  /* prevent click interfering with swipe pause */
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <BsAmazon /> Buy on Amazon
                </span>
              </a>
            </a>
          );
        })}
      </div>

      <style jsx>{`
        .no-scrollbar {
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
