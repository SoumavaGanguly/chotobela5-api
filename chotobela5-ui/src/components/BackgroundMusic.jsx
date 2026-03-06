import { useMusic } from "../context/MusicContext";

export default function BackgroundMusic() {
  const { playing, muted, toggleMusic } = useMusic();

  return (
    <button
      onClick={toggleMusic}
      className="px-4 py-2 rounded-full shadow
      bg-[#f4e6c3cc] backdrop-blur
      border border-[#8b6f3d]
      text-[#4a2c0f]
      hover:bg-[#f0dfb4]"
    >
      {playing && !muted ? "🔇 Mute" : "🎵 Play"}
    </button>
  );
}
