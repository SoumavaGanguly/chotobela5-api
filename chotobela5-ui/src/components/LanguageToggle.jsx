export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setLang(lang === "en" ? "bn" : "en")}
        className="px-4 py-2 bg-black text-white rounded-full text-sm"
      >
        {lang === "en" ? "বাংলা" : "English"}
      </button>
    </div>
  );
}