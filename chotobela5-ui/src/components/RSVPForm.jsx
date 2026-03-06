import { useState } from "react";
import { User, Phone } from "lucide-react";
import { motion } from "framer-motion";
import API from "../services/api";

export default function RSVPForm({ text }) {
  const [form, setForm] = useState({
    guest_name: "",
    mobile: "",
    adults: 1,
    kids: 0,
    food_preference: "Veg",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.guest_name || !form.mobile) return alert("Please fill all fields");
    setLoading(true);
    try {
      await API.post("/rsvp", form);
      alert(text.thankYou);
      setForm({ ...form, guest_name: "", mobile: "" });
    } catch (e) {
      alert("Error submitting RSVP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="p-6 md:p-10 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="glass-card p-8 md:p-12">
        <h3 className="text-3xl md:text-4xl heading-primary mb-8 text-center">{text.rsvpTitle}</h3>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="input-field pl-12"
              placeholder={text.name}
              value={form.guest_name}
              onChange={(e) =>
                setForm({ ...form, guest_name: e.target.value })
              }
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="input-field pl-12"
              placeholder={text.mobile}
              value={form.mobile}
              onChange={(e) =>
                setForm({ ...form, mobile: e.target.value })
              }
            />
          </div>

          <motion.button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full text-xl mt-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Submitting..." : text.submit}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}