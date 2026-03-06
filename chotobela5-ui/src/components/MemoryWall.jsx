import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, ImagePlus, Send } from "lucide-react";
import API from "../services/api";
import paperTexture from "../assets/paper-texture.png";

export default function MemoryWall({ text }) {
  const [memories, setMemories] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMemories = async () => {
    const res = await API.get("/memory");
    setMemories(res.data);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const submitMemory = async () => {
    if (!guestName || !message || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("guest_name", guestName);
    formData.append("message", message);
    formData.append("image", image);

    try {
      setLoading(true);
      await API.post("/memory", formData);
      alert("Thank you for your lovely memory ❤️");

      setGuestName("");
      setMessage("");
      setImage(null);
      fetchMemories();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 mt-12 mb-20 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.h3
        className="text-4xl md:text-5xl text-center mb-10 heading-primary flex items-center justify-center gap-4"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <Camera className="w-10 h-10 md:w-12 md:h-12" />
        {text.memoryWallTitle}
      </motion.h3>

      {/* Upload Form */}
      <motion.div
        className="glass-card p-8 md:p-10 max-w-xl mx-auto mb-20 relative overflow-hidden shadow-2xl"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-primary/30 rounded-tl-xl m-4 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-primary/30 rounded-tr-xl m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-primary/30 rounded-bl-xl m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-primary/30 rounded-br-xl m-4 pointer-events-none"></div>
        {/* Paper texture background */}
        <img
          src={paperTexture}
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none rounded-2xl"
          alt=""
        />
        <input
          className="input-field mb-6"
          placeholder={text.yourName}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />

        <textarea
          className="input-field mb-6 resize-none h-24"
          placeholder={text.yourWishes}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="mb-8 relative mt-2 group">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/30 border-dashed rounded-xl cursor-pointer bg-white/50 hover:bg-primary/5 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImagePlus className="w-8 h-8 mb-3 text-primary/70 group-hover:text-primary transition-colors" />
              <p className="mb-2 text-sm text-gray-700 font-medium">
                <span className="font-semibold text-primary">{text.upload}</span> {text.uploadHint}
              </p>
              <p className="text-xs text-gray-500">{image ? image.name : "SVG, PNG, JPG or GIF"}</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        <motion.button
          onClick={submitMemory}
          disabled={loading || !image || !guestName || !message}
          className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-xl"
          whileHover={(!loading && image && guestName && message) ? { scale: 1.02 } : {}}
          whileTap={(!loading && image && guestName && message) ? { scale: 0.98 } : {}}
        >
          {loading ? text.uploading : (
            <>
              {text.shareMemory} <Send className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        {memories.map((m, i) => (
          <motion.div
            key={i}
            className="bg-white p-5 pb-6 flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:z-20 border border-gray-200 shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 % 0.5, duration: 0.5 }}
            style={{
              rotate: i % 3 === 0 ? '2deg' : i % 3 === 1 ? '-2deg' : '1deg',
              borderRadius: '2px 2px 2px 2px'
            }}
          >
            <div className="w-full aspect-square mb-5 overflow-hidden bg-gray-100 border border-gray-100">
              <img
                src={`${API.defaults.baseURL.replace("/api", "")}/${m.image_url}`}
                alt="Memory"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between px-2">
              <p className="text-xl italic font-english text-gray-800 leading-relaxed mb-4">"{m.message}"</p>
              <p className="text-right mt-auto font-bengali text-lg text-primary">— {m.guest_name || "Guest"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}