import { useState } from "react";
import Landing from "./components/Landing";
import MemoryWall from "./components/MemoryWall";
import FloatingControls from "./components/FloatingControls";
import Decorations from "./components/Decorations";
import content from "./i18n/content";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState("en");

  const text = content[lang];

  // 🔐 Admin route (unchanged)
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-white/40 shadow-2xl border-x border-primary/10">
      <Decorations />
      <FloatingControls lang={lang} setLang={setLang} />
      <AnimatePresence mode="wait">
        {!entered ? (
          <Landing key="landing" onEnter={() => setEntered(true)} text={text} />
        ) : (
          <motion.div
            key="main-content"
            className="pb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MemoryWall text={text} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}