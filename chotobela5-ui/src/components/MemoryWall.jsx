import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, Send, Video, Mic, Square, Upload } from "lucide-react";
import API from "../services/api";
import paperTexture from "../assets/paper-texture.png";
import { useMusic } from "../context/MusicContext";
import { PlaySquare } from "lucide-react";
import InstagramWall from "./InstagramWall";

const BASE_URL = API.defaults.baseURL.replace("/api", "");

const resolveMediaUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BASE_URL}/${url}`;
};

// ─── Timer hook ──────────────────────────────────────────────────────
function useTimer(maxSeconds, onExpire) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed(prev => {
        if (prev + 1 >= maxSeconds) {
          clearInterval(intervalRef.current);
          onExpire();
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
  }, [maxSeconds, onExpire]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setElapsed(0);
  }, []);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return { elapsed, start, stop, fmt };
}

// ─── VideoRecorder tab ───────────────────────────────────────────────
function VideoRecorderTab({ text, guestName, message, onSuccess }) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const previewRef = useRef(null);
  const chunksRef = useRef([]);
  const { muteBgMusic, unmuteBgMusic } = useMusic();

  const stopRecording = useCallback(() => {
    setRecording(false);
    unmuteBgMusic();
    if (mediaRef.current) {
      mediaRef.current.stop();
      mediaRef.current.stream.getTracks().forEach(t => t.stop());
    }
  }, [unmuteBgMusic]);

  const { elapsed, start: startTimer, stop: stopTimer, fmt } = useTimer(120, stopRecording);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (previewRef.current) { previewRef.current.srcObject = stream; previewRef.current.play(); }
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4" });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: mr.mimeType });
        setBlob(b);
        if (previewRef.current) { previewRef.current.srcObject = null; previewRef.current.src = URL.createObjectURL(b); }
        stopTimer();
      };
      mediaRef.current = mr;
      mr.start(200);
      setRecording(true);
      muteBgMusic();
      startTimer();
    } catch {
      alert("Camera access denied or not available.");
    }
  };

  const submit = async () => {
    if (!blob || !guestName || !message) return;
    const ext = blob.type.includes("webm") ? "webm" : "mp4";
    const fd = new FormData();
    fd.append("guest_name", guestName);
    fd.append("message", message);
    fd.append("video", blob, `video.${ext}`);
    try {
      setLoading(true);
      await API.post("/memory/video", fd);
      setBlob(null);
      onSuccess();
    } catch { alert("Upload failed"); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={previewRef} className="w-full rounded-xl bg-black aspect-video" autoPlay muted playsInline controls={!!blob} />
      {recording && (
        <div className="flex items-center gap-3 text-red-600 font-bold text-lg animate-pulse">
          <span className="w-3 h-3 bg-red-600 rounded-full inline-block" />
          {fmt(elapsed)} / 2:00
        </div>
      )}
      {!blob && (
        <motion.button
          onClick={recording ? stopRecording : startRecording}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-lg shadow-lg transition-colors ${recording ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/80"}`}
        >
          {recording ? <><Square className="w-5 h-5" /> {text.stopRecording}</> : <><Video className="w-5 h-5" /> {text.startRecording}</>}
        </motion.button>
      )}
      {blob && (
        <motion.button
          onClick={submit}
          disabled={loading || !guestName || !message}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl"
        >
          {loading ? text.uploading : <><Upload className="w-5 h-5" /> {text.uploadVideo}</>}
        </motion.button>
      )}
      <p className="text-xs text-gray-500">{text.maxDuration2}</p>
    </div>
  );
}

// ─── AudioRecorder tab ───────────────────────────────────────────────
function AudioRecorderTab({ text, guestName, message, onSuccess }) {
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const { muteBgMusic, unmuteBgMusic } = useMusic();

  const stopRecording = useCallback(() => {
    setRecording(false);
    unmuteBgMusic();
    if (mediaRef.current) {
      mediaRef.current.stop();
      mediaRef.current.stream.getTracks().forEach(t => t.stop());
    }
  }, [unmuteBgMusic]);

  const { elapsed, start: startTimer, stop: stopTimer, fmt } = useTimer(180, stopRecording);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const b = new Blob(chunksRef.current, { type: "audio/webm" });
        setBlob(b);
        stopTimer();
      };
      mediaRef.current = mr;
      mr.start(200);
      setRecording(true);
      muteBgMusic();
      startTimer();
    } catch {
      alert("Microphone access denied or not available.");
    }
  };

  const submit = async () => {
    if (!blob || !guestName || !message) return;
    const fd = new FormData();
    fd.append("guest_name", guestName);
    fd.append("message", message);
    fd.append("audio", blob, "audio.webm");
    try {
      setLoading(true);
      await API.post("/memory/audio", fd);
      setBlob(null);
      onSuccess();
    } catch { alert("Upload failed"); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Waveform visualizer */}
      <div className="flex items-end gap-1 h-16 w-full justify-center">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full bg-primary"
            animate={recording ? { height: [6, Math.random() * 50 + 10, 6] } : { height: 6 }}
            transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
          />
        ))}
      </div>

      {recording && (
        <div className="flex items-center gap-3 text-red-600 font-bold text-lg animate-pulse">
          <span className="w-3 h-3 bg-red-600 rounded-full inline-block" />
          {fmt(elapsed)} / 3:00
        </div>
      )}

      {blob && !recording && (
        <audio controls src={URL.createObjectURL(blob)} className="w-full" />
      )}

      {!blob && (
        <motion.button
          onClick={recording ? stopRecording : startRecording}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-lg shadow-lg transition-colors ${recording ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/80"}`}
        >
          {recording ? <><Square className="w-5 h-5" /> {text.stopRecording}</> : <><Mic className="w-5 h-5" /> {text.startRecording}</>}
        </motion.button>
      )}

      {blob && (
        <motion.button
          onClick={submit}
          disabled={loading || !guestName || !message}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl"
        >
          {loading ? text.uploading : <><Upload className="w-5 h-5" /> {text.uploadAudio}</>}
        </motion.button>
      )}
      <p className="text-xs text-gray-500">{text.maxDuration3}</p>
    </div>
  );
}

// ─── Gallery card ────────────────────────────────────────────────────
function MemoryCard({ m, i }) {
  const base = BASE_URL;
  return (
    <motion.div
      key={i}
      className="bg-white p-5 pb-6 flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:z-20 border border-gray-200 shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: i * 0.1 % 0.5, duration: 0.5 }}
      style={{ rotate: i % 3 === 0 ? "2deg" : i % 3 === 1 ? "-2deg" : "1deg", borderRadius: "2px" }}
    >
      <div className="w-full aspect-square mb-5 overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
        {m.type === "photo" && m.image_url && (
          <img src={resolveMediaUrl(m.image_url)} alt="Memory" className="w-full h-full object-cover" />
        )}
        {m.type === "video" && m.video_url && (
          <video src={resolveMediaUrl(m.video_url)} controls className="w-full h-full object-cover" />
        )}
        {m.type === "audio" && m.audio_url && (
          <div className="flex flex-col items-center gap-3 p-4">
            <Mic className="w-12 h-12 text-primary/60" />
            <audio src={resolveMediaUrl(m.audio_url)} controls className="w-full" />
          </div>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-between px-2">
        <p className="text-xl italic font-english text-gray-800 leading-relaxed mb-4">"{m.message}"</p>
        <p className="text-right mt-auto font-bengali text-lg text-primary">— {m.guest_name || "Guest"}</p>
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────
export default function MemoryWall({ text, onNavigateToEvent }) {
  const [memories, setMemories] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("photo");
  const [showSlider, setShowSlider] = useState(false);

  const fetchMemories = async () => {
    const res = await API.get("/memory");
    setMemories(res.data);
  };

  useEffect(() => { fetchMemories(); }, []);

  const submitPhoto = async () => {
    if (!guestName || !message || !image) { alert("Please fill all fields"); return; }
    const fd = new FormData();
    fd.append("guest_name", guestName);
    fd.append("message", message);
    fd.append("image", image);
    try {
      setLoading(true);
      await API.post("/memory", fd);
      alert("Thank you for your lovely memory ❤️");
      setGuestName(""); setMessage(""); setImage(null);
      fetchMemories();
    } catch { alert("Upload failed"); } finally { setLoading(false); }
  };

  const TABS = [
    { id: "photo", label: text.tabPhoto, icon: <Camera className="w-4 h-4" /> },
    { id: "video", label: text.tabVideo, icon: <Video className="w-4 h-4" /> },
    { id: "audio", label: text.tabAudio, icon: <Mic className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      className="p-6 mt-12 mb-20 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Title */}
      <motion.h3
        className="text-4xl md:text-5xl text-center mb-10 heading-primary flex items-center justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <Camera className="w-10 h-10 md:w-12 md:h-12" />
        {text.memoryWallTitle}
      </motion.h3>

      {/* Event Details Button */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <motion.button
          onClick={onNavigateToEvent}
          className="btn-primary px-8 py-3 text-lg flex items-center gap-2 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {text.viewEvent}
        </motion.button>
      </motion.div>

      {/* Sliding Toggle Button */}
      <motion.div
        className="flex items-center justify-center gap-4 mb-14"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.18 }}
      >
        <span
          onClick={() => setShowSlider(false)}
          className={`text-lg font-bold cursor-pointer transition-colors ${!showSlider ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Share Memory
        </span>

        <div
          onClick={() => setShowSlider(!showSlider)}
          className="w-24 h-12 bg-gray-200 rounded-full p-1 cursor-pointer flex items-center relative shadow-inner border border-gray-300"
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 shadow-md flex items-center justify-center"
            animate={{ x: showSlider ? 48 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <PlaySquare className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        <span
          onClick={() => setShowSlider(true)}
          className={`text-lg font-bold cursor-pointer transition-all ${showSlider ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Instagram Wall
        </span>
      </motion.div>

      {/* Conditional Content based on Toggle */}
      <AnimatePresence mode="wait">
        {!showSlider ? (
          <motion.div
            key="upload-form"
            className="glass-card p-8 md:p-10 max-w-xl mx-auto mb-20 relative overflow-hidden shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary/30 rounded-tl-xl m-4 pointer-events-none" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary/30 rounded-tr-xl m-4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary/30 rounded-bl-xl m-4 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary/30 rounded-br-xl m-4 pointer-events-none" />
            <img src={paperTexture} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none rounded-2xl" alt="" />

            {/* Shared name + message fields */}
            <input
              className="input-field mb-6"
              placeholder={text.yourName}
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
            />
            <textarea
              className="input-field mb-6 resize-none h-24"
              placeholder={text.yourWishes}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />

            {/* Tab switcher */}
            <div className="flex gap-2 mb-6 bg-black/5 rounded-xl p-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-primary text-white shadow-md" : "text-gray-600 hover:bg-white/60"}`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "photo" && (
                  <div>
                    <div className="mb-8 relative mt-2 group">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-primary/5 transition-colors duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImagePlus className="w-8 h-8 mb-3 text-primary/70 group-hover:text-primary transition-colors" />
                          <p className="mb-2 text-sm text-gray-700 font-medium">
                            <span className="font-semibold text-primary">{text.upload}</span> {text.uploadHint}
                          </p>
                          <p className="text-xs text-gray-500">{image ? image.name : "SVG, PNG, JPG or GIF"}</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                      </label>
                    </div>
                    <motion.button
                      onClick={submitPhoto}
                      disabled={loading || !image || !guestName || !message}
                      className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl"
                      whileHover={(!loading && image && guestName && message) ? { scale: 1.02 } : {}}
                      whileTap={(!loading && image && guestName && message) ? { scale: 0.98 } : {}}
                    >
                      {loading ? text.uploading : <>{text.shareMemory} <Send className="w-5 h-5" /></>}
                    </motion.button>
                  </div>
                )}

                {activeTab === "video" && (
                  <VideoRecorderTab
                    text={text}
                    guestName={guestName}
                    message={message}
                    onSuccess={() => { alert("Thank you for your video memory ❤️"); fetchMemories(); }}
                  />
                )}

                {activeTab === "audio" && (
                  <AudioRecorderTab
                    text={text}
                    guestName={guestName}
                    message={message}
                    onSuccess={() => { alert("Thank you for your audio memory ❤️"); fetchMemories(); }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="instagram-wall"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <InstagramWall
              memories={memories}
              onClose={() => setShowSlider(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}