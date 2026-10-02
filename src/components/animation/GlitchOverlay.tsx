"use client";

import { motion } from "framer-motion";

export default function GlitchOverlay() {
    const glitchConfig = Array.from({ length: 10 }, (_, index) => ({
        x: Math.sin(index * 12.7) * 50,
        y: Math.cos(index * 8.3) * 50,
        width: 50 + ((index * 37) % 200),
        height: 20 + ((index * 19) % 100),
        delay: (index % 5) * 0.04,
        top: (index * 31) % 100,
        left: (index * 67) % 100,
    }));
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{
                opacity: [0, 1, 0, 1, 0],
                transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 1],
                    ease: "linear"
                }
            }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center pointer-events-none"
        >
            {/* Scanlines Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 2px, 3px 100%'
                }}
            />

            {/* Random Glitch Blocks */}
            {/* Random Glitch Blocks */}
            {glitchConfig.map((glitch, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-accent/20"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        x: [0, glitch.x, 0],
                        y: [0, glitch.y, 0],
                        width: [0, glitch.width, 0],
                        height: [0, glitch.height, 0]
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: glitch.delay
                    }}
                    style={{
                        top: `${glitch.top}%`,
                        left: `${glitch.left}%`
                    }}
                />
            ))}

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-accent font-black tracking-[1em] uppercase text-xl relative z-10"
            >
                Synchronizing
            </motion.div>
        </motion.div>
    );
}
