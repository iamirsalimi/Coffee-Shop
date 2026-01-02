import React from "react";
import { motion } from "framer-motion";

const journeyText = `
Our journey began with a simple idea: to create a place where great coffee meets a welcoming atmosphere.
From the very beginning, we wanted more than just a café.

We imagined a space where people could slow down, feel comfortable, and truly enjoy the moment.
Every detail matters to us — from carefully selected beans to thoughtful preparation and warm service.

What started as a personal passion has grown into a community built around quality, care, and consistency.
A place where every cup tells a story, and every visit feels familiar.
`;

const container = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function TypewriterText({ text }) {
  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center text-base sm:text-lg md:text-xl lg:text-2xl md:leading-11 text-gray-300 p-5 md:p-12"
    >
        {/* split the text and set the animation for each letter separately */}
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={letter}>
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

function OurJourney() {
  return (
    <div className="py-16 px-5 mx-auto relative w-full min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-full md:w-[90%] h-[calc(100vh-2rem)] rounded-4xl overflow-hidden">
        <img
          src="Images/About-2.jpg"
          className="object-cover object-center w-full h-full"
          alt="Our journey"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[95%] h-[95%] rounded-3xl bg-black/70 backdrop-blur-2xl">
            <TypewriterText text={journeyText} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurJourney;