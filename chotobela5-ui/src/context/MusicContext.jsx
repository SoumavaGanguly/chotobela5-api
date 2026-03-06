import { createContext, useContext, useRef, useEffect, useState } from "react";
import music from "../assets/music.mp3";

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);

    // Play on first user gesture (required by browsers)
    useEffect(() => {
        const audio = new Audio(music);
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;

        const tryPlay = () => {
            audio.play().then(() => setPlaying(true)).catch(() => { });
        };

        window.addEventListener("click", tryPlay, { once: true });
        window.addEventListener("touchstart", tryPlay, { once: true });

        return () => {
            audio.pause();
            window.removeEventListener("click", tryPlay);
            window.removeEventListener("touchstart", tryPlay);
        };
    }, []);

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing) { audio.pause(); setPlaying(false); }
        else { audio.play().then(() => setPlaying(true)).catch(() => { }); }
    };

    const muteBgMusic = () => {
        if (audioRef.current) { audioRef.current.volume = 0; setMuted(true); }
    };

    const unmuteBgMusic = () => {
        if (audioRef.current) { audioRef.current.volume = 0.3; setMuted(false); }
    };

    return (
        <MusicContext.Provider value={{ playing, muted, toggleMusic, muteBgMusic, unmuteBgMusic }}>
            {children}
        </MusicContext.Provider>
    );
}

export function useMusic() {
    return useContext(MusicContext);
}
