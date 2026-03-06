import LanguageToggle from "./LanguageToggle";
import BackgroundMusic from "./BackgroundMusic";

export default function FloatingControls({ lang, setLang }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 items-end">
      <LanguageToggle lang={lang} setLang={setLang} />
      <BackgroundMusic />
    </div>
  );
}