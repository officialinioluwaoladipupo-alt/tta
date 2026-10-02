"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Asterisk } from "@/components/ui/DecorativeGraphics";

export default function Preloader() {
  const pathname = usePathname();
  const [finishedPath, setFinishedPath] = useState<string | null>(null);
  const isLoading = finishedPath !== pathname;

  useEffect(() => {
    // Reset loading state on path change
    document.body.style.overflow = "hidden";
    
    // Sequence timing
    const timer = setTimeout(() => {
      setFinishedPath(pathname);
      document.body.style.overflow = "unset";
    }, 2500); // 2.5s total duration

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
           key="preloader"
           initial={{ opacity: 1 }}
           exit={{ opacity: 0, y: -50 }}
           transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
           className="fixed inset-0 z-9999 bg-background flex flex-col items-center justify-center overflow-hidden"
        >
           <motion.div
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 1.2, opacity: 0 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="relative flex flex-col items-center gap-8"
           >
              {/* Spinning Asterisk */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Asterisk className="w-24 h-24 sm:w-32 sm:h-32 text-accent" />
              </motion.div>

              {/* TTA Logo */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground font-logo"
              >
                TTA
              </motion.h1>

              {/* Loading Bar */}
              <motion.div 
                 className="w-48 h-[2px] bg-foreground/10 overflow-hidden relative mt-4"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1 }}
              >
                 <motion.div 
                   className="absolute inset-0 bg-accent"
                   initial={{ x: "-100%" }}
                   animate={{ x: "0%" }}
                   transition={{ duration: 1.5, ease: "easeInOut" }}
                 />
              </motion.div>
           </motion.div>

           {/* Footer Text */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.2 }}
             className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30"
           >
             System Loading...
           </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
