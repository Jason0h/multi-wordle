import { motion } from "motion/react";

export default function Tile({ letter }: { letter: string }) {
  return (
    <motion.div
      key={letter || undefined}
      initial={false}
      animate={letter ? { scale: [1, 1.05, 1] } : undefined}
      transition={{ duration: 0.075 }}
      className="flex h-14 w-14 items-center justify-center border-2 border-border text-2xl font-bold uppercase"
    >
      {letter}
    </motion.div>
  );
}
