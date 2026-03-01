import { useEffect, useState } from "react";
import API from "../services/api";

export default function MemoryWall() {
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
    <div className="p-6 mt-12">
      <h3 className="text-3xl text-center mb-6">📸 Memory Wall</h3>

      {/* Upload Form */}
      <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto mb-10">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Your wishes"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-3"
        />

        <button
          onClick={submitMemory}
          disabled={loading}
          className="w-full bg-indigo-800 text-white py-2 rounded"
        >
          {loading ? "Uploading..." : "Share Memory"}
        </button>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {memories.map((m, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-lg shadow-lg rotate-1"
          >
            <img
              src={`${API.defaults.baseURL.replace("/api", "")}/${m.image_url}`}
              alt=""
              className="rounded mb-2"
            />
            <p className="text-sm italic">"{m.message}"</p>
            <p className="text-xs text-right mt-2">– {m.guest_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}