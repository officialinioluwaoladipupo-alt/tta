"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ProgramsFooter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-[1600px] w-full px-6 py-40 border-x border-t border-foreground/5 flex flex-col items-center text-center bg-dot-pattern"
    >
       <motion.div variants={itemVariants} className="max-w-xl mx-auto">
         <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-foreground">Access Verification</h2>
         <p className="text-foreground/40 mb-10 leading-relaxed">
           Certain intensives require community verification. Join the TTA Telegram to initiate the onboarding process.
         </p>
         <Link href="https://chat.whatsapp.com/CH4I9YLQ7tSJY4RFliOwpO" className="btn-outline px-12 transition-colors">
            Inquire via Hub
         </Link>
       </motion.div>
    </motion.section>
  );
}
