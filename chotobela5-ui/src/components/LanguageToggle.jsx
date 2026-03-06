export default function LanguageToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "bn" : "en")}
      className="px-4 py-2 rounded-full text-sm shadow
      bg-[#f4e6c3cc] backdrop-blur
      border border-[#8b6f3d]
      text-[#4a2c0f]
      hover:bg-[#f0dfb4]"
    >
      {lang === "en" ? "বাংলা" : "English"}
    </button>
  );
}