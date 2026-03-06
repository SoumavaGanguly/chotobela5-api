import { useState } from "react";
import Landing from "./components/Landing";
import MemoryWall from "./components/MemoryWall";
import EventPage from "./components/EventPage";
import FloatingControls from "./components/FloatingControls";
import Decorations from "./components/Decorations";
import content from "./i18n/content";
import { motion, AnimatePresence } from "framer-motion";
import { MusicProvider } from "./context/MusicContext";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("memory"); // "memory" | "event"

  const text = content[lang];

  // 🔐 Admin route (unchanged)
  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <MusicProvider>
      <div className="max-w-md mx-auto min-h-screen relative bg-white/40 shadow-2xl border-x border-primary/10">
        <Decorations />
        <FloatingControls lang={lang} setLang={setLang} />
        <AnimatePresence mode="wait">
          {!entered ? (
            <Landing key="landing" onEnter={() => setEntered(true)} text={text} />
          ) : page === "event" ? (
            <motion.div
              key="event-page"
              className="pb-24"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
            >
              <EventPage text={text} onBack={() => setPage("memory")} />
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              className="pb-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MemoryWall text={text} onNavigateToEvent={() => setPage("event")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MusicProvider>
  );
}