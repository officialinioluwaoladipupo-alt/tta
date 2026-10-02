"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  font?: string;
}

export default function GlitchText({ text, className = "", as: Component = "span", font = "" }: GlitchTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const words = text.split(" ");
  let charIndex = 0;

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    }),
  };

  return (
    <Component ref={ref} className={`${className} ${font} inline-block`}>
      <motion.div
        className="flex flex-wrap gap-x-[0.25em] justify-center"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {words.map((word, i) => (
          <span key={i} className="whitespace-nowrap inline-block">
            {Array.from(word).map((letter, j) => {
              const index = charIndex++;
              return (
                <motion.span
                  variants={child}
                  custom={index}
                  key={j}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              );
            })}
          </span>
        ))}
      </motion.div>
    </Component>
  );
}
