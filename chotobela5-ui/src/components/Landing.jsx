import { motion } from "framer-motion";

export default function Landing({ onEnter, text }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-5xl mb-4">{text.title}</h1>

      <p className="text-lg mb-2 italic">{text.subtitle}</p>

      <p className="mb-6">{text.intro}</p>

      <button
        onClick={onEnter}
        className="px-6 py-3 bg-red-800 text-white rounded-xl"
      >
        {text.enter}
      </button>
    </motion.div>
  );
}