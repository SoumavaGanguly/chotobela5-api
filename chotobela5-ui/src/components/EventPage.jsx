import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink, User, Phone, Users, Baby, ArrowLeft, CheckCircle } from "lucide-react";
import API from "../services/api";
import paperTexture from "../assets/paper-texture.png";

// ─── Invitation section ───────────────────────────────────────────────
function InvitationCard({ text }) {
    return (
        <motion.div
            className="glass-card p-8 md:p-10 text-center relative overflow-hidden mb-8 shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-14 h-14 border-t-4 border-l-4 border-primary/30 rounded-tl-xl m-3 pointer-events-none" />
            <div className="absolute top-0 right-0 w-14 h-14 border-t-4 border-r-4 border-primary/30 rounded-tr-xl m-3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-14 h-14 border-b-4 border-l-4 border-primary/30 rounded-bl-xl m-3 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-14 h-14 border-b-4 border-r-4 border-primary/30 rounded-br-xl m-3 pointer-events-none" />

            <motion.h2
                className="text-4xl md:text-5xl mb-8 heading-primary"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {text.invitationTitle}
            </motion.h2>

            <div className="space-y-5 text-xl md:text-2xl font-english text-gray-800">
                <motion.div className="flex items-center justify-center gap-4" whileHover={{ scale: 1.04 }}>
                    <Calendar className="text-primary w-7 h-7 flex-shrink-0" />
                    <span className="font-semibold">{text.date}</span>
                </motion.div>
                <motion.div className="flex items-center justify-center gap-4" whileHover={{ scale: 1.04 }}>
                    <Clock className="text-primary w-7 h-7 flex-shrink-0" />
                    <span>{text.time}</span>
                </motion.div>
                <motion.div className="flex items-start justify-center gap-4" whileHover={{ scale: 1.02 }}>
                    <MapPin className="text-primary w-7 h-7 flex-shrink-0 mt-1" />
                    <span className="leading-relaxed text-left">{text.venue}</span>
                </motion.div>
            </div>

            <motion.a
                href="https://maps.google.com/?q=SP+Joyville+Annex+Pune"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-lg transition-colors"
                whileHover={{ x: 4 }}
            >
                <ExternalLink className="w-5 h-5" />
                {text.openMaps}
            </motion.a>
        </motion.div>
    );
}

// ─── RSVP form section ────────────────────────────────────────────────
function RSVPSection({ text }) {
    const [form, setForm] = useState({
        guest_name: "",
        mobile: "",
        adults: 1,
        kids: 0,
        food_preference: "Veg",
        note: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const submit = async () => {
        if (!form.guest_name || !form.mobile) return alert("Please fill Name and Mobile");
        try {
            setLoading(true);
            await API.post("/rsvp", form);
            setSubmitted(true);
        } catch {
            alert("Error submitting RSVP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <motion.div
                className="glass-card p-10 text-center shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-3xl heading-primary mb-2">{text.thankYou}</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
        >
            <img src={paperTexture} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none rounded-2xl" alt="" />

            <h3 className="text-3xl md:text-4xl heading-primary mb-8 text-center">{text.rsvpTitle}</h3>

            <div className="space-y-8">
                {/* Name */}
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        className="input-field pl-12"
                        placeholder={text.name}
                        value={form.guest_name}
                        onChange={e => set("guest_name", e.target.value)}
                    />
                </div>

                {/* Mobile */}
                <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        className="input-field pl-12"
                        placeholder={text.mobile}
                        type="tel"
                        value={form.mobile}
                        onChange={e => set("mobile", e.target.value)}
                    />
                </div>

                {/* Adults + Kids */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-bold text-gray-700 mb-1 ml-1" style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.05rem" }}>{text.adults}</label>
                        <div className="flex items-center gap-3 input-field justify-between">
                            <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <button onClick={() => set("adults", Math.max(1, form.adults - 1))} className="text-primary font-bold text-2xl w-8">−</button>
                            <span style={{ fontFamily: "'Special Elite', cursive", fontWeight: 700, fontSize: "1.3rem" }} className="w-6 text-center">{form.adults}</span>
                            <button onClick={() => set("adults", form.adults + 1)} className="text-primary font-bold text-2xl w-8">+</button>
                        </div>
                    </div>
                    <div>
                        <label className="block font-bold text-gray-700 mb-1 ml-1" style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.05rem" }}>{text.kids}</label>
                        <div className="flex items-center gap-3 input-field justify-between">
                            <Baby className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <button onClick={() => set("kids", Math.max(0, form.kids - 1))} className="text-primary font-bold text-2xl w-8">−</button>
                            <span style={{ fontFamily: "'Special Elite', cursive", fontWeight: 700, fontSize: "1.3rem" }} className="w-6 text-center">{form.kids}</span>
                            <button onClick={() => set("kids", form.kids + 1)} className="text-primary font-bold text-2xl w-8">+</button>
                        </div>
                    </div>
                </div>

                {/* Food Preference */}
                <div>
                    <label className="block font-bold text-gray-700 mb-2 ml-1" style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.1rem" }}>{text.foodPref}</label>
                    <div className="flex gap-3">
                        {[
                            { value: "Veg", label: text.veg },
                            { value: "Non-Veg", label: text.nonveg },
                        ].map(opt => (
                            <label
                                key={opt.value}
                                className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${form.food_preference === opt.value ? "border-primary bg-primary/10 shadow-md" : "border-gray-200 bg-white/60 hover:border-primary/40"}`}
                            >
                                <input
                                    type="radio"
                                    name="food_preference"
                                    value={opt.value}
                                    checked={form.food_preference === opt.value}
                                    onChange={() => set("food_preference", opt.value)}
                                    className="w-5 h-5 accent-primary flex-shrink-0"
                                />
                                <span style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.15rem", fontWeight: 700 }} className={form.food_preference === opt.value ? "text-primary" : "text-gray-800"}>
                                    {opt.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Note */}
                <textarea
                    className="input-field resize-none h-20"
                    placeholder={text.note}
                    value={form.note}
                    onChange={e => set("note", e.target.value)}
                />

                {/* Submit */}
                <motion.button
                    onClick={submit}
                    disabled={loading}
                    className="btn-primary w-full py-4 text-xl flex items-center justify-center gap-2"
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                >
                    {loading ? text.submitting : text.submit}
                </motion.button>
            </div>
        </motion.div>
    );
}

// ─── Main EventPage ───────────────────────────────────────────────────
export default function EventPage({ text, onBack }) {
    return (
        <motion.div
            className="p-6 mt-6 mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Back button — top right corner */}
            <div className="flex justify-end mb-6">
                <motion.button
                    onClick={onBack}
                    className="btn-primary flex items-center gap-2 px-5 py-2 text-base"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    {text.backToMemories}
                </motion.button>
            </div>

            <InvitationCard text={text} />
            <RSVPSection text={text} />
        </motion.div>
    );
}
