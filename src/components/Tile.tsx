import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";
import { TileStatus } from "@/types";
import { WORD_LENGTH } from "@/lib/constants";

const TILE_COLORS: Record<Exclude<TileStatus, "idle">, string> = {
  correct: "bg-chart-2 text-white dark:text-black border-chart-2",
  present: "bg-primary text-white dark:text-black border-primary",
  absent:
    "bg-muted-foreground text-white dark:text-black border-muted-foreground",
};

export default function Tile({
  letter,
  status = "idle",
  index = 0,
  won = false,
}: {
  letter: string;
  status?: TileStatus;
  index?: number;
  won?: boolean;
}) {
  const [scope, animate] = useAnimate();
  const [revealed, setRevealed] = useState(status !== "idle");
  const prevStatus = useRef(status);

  useEffect(() => {
    // Skip animation if tile was already revealed on mount
    if (status === "idle" || prevStatus.current === status) return;
    prevStatus.current = status;

    let cancelled = false;
    const run = async () => {
      await new Promise((r) => setTimeout(r, index * 200));
      if (cancelled) return;
      await animate(scope.current, { rotateX: 90 }, { duration: 0.15 });
      if (cancelled) return;
      setRevealed(true);
      await animate(scope.current, { rotateX: 0 }, { duration: 0.15 });
      if (cancelled || !won) return;
      // Wait for all tiles to finish flipping, then stagger the bounce wave
      const waitForOthers = (WORD_LENGTH - 1 - index) * 0.2;
      const bounceStagger = index * 0.1;
      await animate(
        scope.current,
        { y: [0, -20, 0] },
        { duration: 0.3, delay: waitForOthers + bounceStagger },
      );
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [status, index, animate, scope, won]);

  const colorClasses = revealed && status !== "idle" ? TILE_COLORS[status] : "";

  return (
    <div style={{ perspective: 500 }}>
      <motion.div
        ref={scope}
        key={letter || undefined}
        initial={false}
        animate={letter && !revealed ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 0.1 }}
        className={`flex h-14 w-14 items-center justify-center border-2 border-border text-2xl font-bold uppercase ${colorClasses}`}
      >
        {letter}
      </motion.div>
    </div>
  );
}
