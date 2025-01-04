"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] flex items-center justify-center z-50">
      <div className="relative">
        {/* Logo animé */}
        <motion.div
          className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/logo.png"
            alt="SplashCamper Loader"
            width={300}
            height={300}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        {/* Effet de vagues */}
        <motion.div
          className="absolute bottom-[-50px] left-[-100px] right-[-100px] h-[100px] bg-blue-400/20"
          animate={{
            scaleY: [1, 1.5, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            borderRadius: "100%",
            filter: "blur(8px)",
          }}
        />

        {/* Bulles d'eau améliorées */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 30 + 10,
              height: Math.random() * 30 + 10,
              left: `${Math.random() * 120 - 10}%`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
              filter: "blur(1px)",
            }}
            animate={{
              y: [200, -200],
              x: [0, Math.random() * 50 - 25],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Texte de chargement animé */}
      <div className="absolute bottom-10 text-white text-xl font-semibold flex items-center gap-2">
        <motion.span
          animate={{ opacity: [0.5, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Chargement
        </motion.span>
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          >
            .
          </motion.span>
        ))}
      </div>

      {/* Cercles concentriques */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-white/20"
          style={{
            width: 300 + i * 60,
            height: 300 + i * 60,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default LoadingScreen;
