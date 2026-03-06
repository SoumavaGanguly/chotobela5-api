import { useState, useEffect } from "react";
import bgPic from "../assets/illustrations/background-pic.png";
import smallBg from "../assets/illustrations/small_background.png";

export default function Decorations() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <img
        src={isMobile ? smallBg : bgPic}
        className="absolute inset-0 w-full h-full object-contain opacity-50 -z-10 pointer-events-none"
        alt="Background Illustration"
      />
    </>
  );
}