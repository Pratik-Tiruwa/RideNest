"use client";
import React from "react";
import { motion } from "motion/react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/heroImage.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/78" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white font-extrabold text-4xl sm:text-5xl md:text-7xl"
        >
          Book any Vehicle
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 max-w-xl text-gray-300"
        >
          From daily Rides to heavy transport - all in one platform
        </motion.p>
      </div>
    </div>
  );
};

export default HeroSection;
