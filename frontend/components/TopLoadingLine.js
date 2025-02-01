/* import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TopLoadingLine() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const handleStart = () => {
      setLoadingProgress(80);
    };

    const handleComplete = () => {
      setLoadingProgress(100);
      setTimeout(() => {
        setLoadingProgress(0);
      }, 500);
    };

    // Add event listeners for page loading
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Clean up event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events]);

  return (
    <>
      <div className="topLoadingLine" style={{ width: `${loadingProgress}%` }}></div>
    </>
  );
}
 */
