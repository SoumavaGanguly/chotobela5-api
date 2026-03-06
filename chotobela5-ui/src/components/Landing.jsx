import { motion } from "framer-motion";

export default function Landing({ onEnter, text }) {
  return (
    <motion.div
      className="min-h-screen px-2 py-6 flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative z-10 w-full px-2 py-8">
        <motion.div
          className="glass-card p-6 md:p-10 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl heading-primary mb-4 drop-shadow-sm leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {text.title}
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl lg:text-4xl heading-secondary italic mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {text.subtitle}
          </motion.p>

          <motion.p
            className="text-xl md:text-2xl font-bengali mb-12 text-gray-800 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            {text.intro}
          </motion.p>

          <motion.div
            className="flex items-center justify-center my-10"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <div className="w-24 md:w-32 h-[2px] bg-primary opacity-60"></div>
            <span className="mx-6 text-primary text-2xl">✽</span>
            <div className="w-24 md:w-32 h-[2px] bg-primary opacity-60"></div>
          </motion.div>

          <motion.button
            onClick={onEnter}
            className="btn-primary text-xl md:text-2xl px-10 py-4 mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            {text.enter}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}