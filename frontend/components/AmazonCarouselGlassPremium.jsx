"use client";
import Image from "next/image";
import { BsAmazon } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";

/**
 * AmazonCarouselGlassPremium
 * Props:
 *  - products: array of product objects (title, price, image, url)
 *
 * This version:
 *  - waits until scrollWidth > clientWidth before starting auto-scroll
 *  - duplicates items for seamless loop
 *  - uses requestAnimationFrame reliably (works in Strict Mode)
 *  - stops on hover/tap
 */
export default function AmazonCarouselGlassPremium({ products = [] }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState([]);

  // Duplicate list for seamless loop
  useEffect(() => {
    if (!products || products.length === 0) {
      setItems([]);
      return;
    }
    setItems([...products, ...products]);
  }, [products]);

  // Ensure we start only when layout is ready and scrollable
  useEffect(() => {
    const el = containerRef.current;
    if (!el || items.length === 0) return;

    // helper: check if scrollable horizontally
    function isScrollable() {
      return el.scrollWidth > el.clientWidth + 1; // tolerance
    }

    // If not scrollable yet, wait a bit for images/layout to settle
    let attempts = 0;
    const maxAttempts = 50;

    const startWhenReady = () => {
      if (isScrollable()) {
        el.scrollLeft = 1;
        el.scrollLeft = 0;
        setReady(true);
        startLoop();
      } else if (attempts < maxAttempts) {
        attempts++;
        // try again shortly (gives images time to load)
        setTimeout(startWhenReady, 80);
      } else {
        // still not scrollable — still start (works for small sets)
        setReady(true);
        startLoop();
      }
    };

    // set scrollLeft to 0 to ensure consistent starting point
    el.scrollLeft = 0;
    startWhenReady();

    // cleanup on unmount
    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Auto-scroll loop
  function startLoop() {
    const el = containerRef.current;
    console.log("startLoop CALLED, el:", el);
    if (!el) return;
    console.log("paused?", pausedRef.current);

    // speed px per frame (tweak here). Use smaller on mobile.
    const baseSpeed =
      typeof window !== "undefined" && window.innerWidth < 768 ? 0.18 : 0.36;

    let lastTime = null;

    function step(time) {
      if (!el) return;
      if (pausedRef.current) {
        console.log("PAUSED – NO SCROLL");
      } else {
        console.log("SCROLLING…", el.scrollLeft);
      }

      if (!lastTime) lastTime = time;
      const dt = time - lastTime;
      lastTime = time;

      if (!pausedRef.current) {
        // move based on delta to keep consistent speed regardless of frame rate
        const px = baseSpeed * (dt / (1000 / 60)); // normalize to ~60fps baseline
        el.scrollLeft += px;

        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          // jump back by half -> seamless
          el.scrollLeft = el.scrollLeft - half;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }

  // Pause/resume handlers (desktop + mobile)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleEnter = () => (pausedRef.current = true);
    const handleLeave = () => (pausedRef.current = false);
    const handlePointerDown = () => (pausedRef.current = true);
    const handlePointerUp = () => {
      // resume after small delay to allow swipe interactions to finish
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

  if (!items || items.length === 0) return null;

  return (
    <div className="premium-wrapper" relative>
      <div
        ref={containerRef}
        className="carousel flex flex-row flex-nowrap items-start gap-6"
        role="list"
        aria-label="Featured products carousel"
      >
        {items.map((p, i) => {
          const img =
            p?.image && p.image.startsWith("http")
              ? p.image
              : p?.image || "/img/noimage.jpg";
          return (
            <a
              key={`${p?.asin || i}-${i}`}
              href={p?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              role="listitem"
              tabIndex={-1}
            >
              <div className="img-wrap" aria-hidden>
                <Image
                  src={img}
                  alt={p?.title || "Product"}
                  width={160}
                  height={140}
                  className="card-img"
                />
              </div>
              <div className="card-body">
                <h4>{p?.title || "Product"}</h4>
                <p>{p?.price || ""}</p>
              </div>
            </a>
          );
        })}
      </div>
      <div className="fade-left" />
      <div className="fade-right" />
    </div>
  );
}
