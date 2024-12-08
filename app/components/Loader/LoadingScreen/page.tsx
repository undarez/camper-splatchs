"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] flex items-center justify-center z-50">
      <div className="relative">
        <motion.div
          className="relative w-[400px] h-[400px]"
          animate={{
            y: [-10, 10],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            rotate: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
        ></motion.div>
        <Image
          src="/images/logo.png"
          alt="Splachamer Camper Loader"
          width={400}
          height={400}
          className="object-contain"
          priority
        />

        {/* Effet de bulles d'eau */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200/30"
            style={{
              width: Math.random() * 20 + 10,
              height: Math.random() * 20 + 10,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Texte de chargement */}
      <motion.div
        className="absolute bottom-10 text-white text-xl font-semibold"
        animate={{ opacity: [0.5, 1] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        Chargement...
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
