import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Invitation({ text }) {
  return (
    <motion.div
      className="p-6 md:p-10 max-w-2xl mx-auto my-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/30 rounded-tl-xl m-4"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary/30 rounded-tr-xl m-4"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary/30 rounded-bl-xl m-4"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/30 rounded-br-xl m-4"></div>

        <h2 className="text-4xl md:text-5xl mb-8 heading-primary">
          {text.invitationTitle}
        </h2>

        <div className="space-y-6 text-xl md:text-2xl font-english text-gray-800">
          <motion.div
            className="flex items-center justify-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="text-primary w-8 h-8" />
            <span>{text.date}</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="text-primary w-8 h-8" />
            <span>{text.time}</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-4"
            whileHover={{ scale: 1.05 }}
          >
            <MapPin className="text-primary w-8 h-8 flex-shrink-0" />
            <span className="leading-relaxed">{text.venue}</span>
          </motion.div>
        </div>

        <motion.a
          href="https://maps.google.com/?q=SP+Joyville+Annex+Pune"
          target="_blank"
          className="inline-flex items-center justify-center mt-10 space-x-2 text-primary hover:text-primary-light transition-colors duration-300 text-lg md:text-xl font-medium"
          whileHover={{ x: 5 }}
        >
          <span>Open in Google Maps</span>
          <ExternalLink className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.div>
  );
}