import { useEffect, useRef, useState } from "react";
import music from "../assets/music.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src={music} />

      <button
        onClick={toggleMusic}
        className="px-4 py-2 rounded-full shadow
        bg-[#f4e6c3cc] backdrop-blur
        border border-[#8b6f3d]
        text-[#4a2c0f]
        hover:bg-[#f0dfb4]"
      >      
        {playing ? "🔇 Mute" : "🎵 Play"}
      </button>
    </>
  );
}