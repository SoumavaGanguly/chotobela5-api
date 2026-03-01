import BackgroundMusic from "./components/BackgroundMusic";
import { useState } from "react";
import Landing from "./components/Landing";
import Invitation from "./components/Invitation";
import RSVPForm from "./components/RSVPForm";
import MemoryWall from "./components/MemoryWall";
import LanguageToggle from "./components/LanguageToggle";
import content from "./i18n/content";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [lang, setLang] = useState("en");

  const text = content[lang];

  if (window.location.pathname === "/admin") {
    return <AdminDashboard />;
  }
  
  return (
    <>
      <BackgroundMusic />
      <LanguageToggle lang={lang} setLang={setLang} />

      {!entered ? (
        <Landing onEnter={() => setEntered(true)} text={text} />
      ) : (
        <>
          <Invitation text={text} />
          <RSVPForm text={text} />
          <MemoryWall />
        </>
      )}
    </>
  );
}