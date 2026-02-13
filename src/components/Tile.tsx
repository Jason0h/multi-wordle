import { useEffect, useRef, useState } from "react";
import { motion, useAnimate } from "motion/react";
import { TileStatus } from "@/types";

const TILE_COLORS: Record<Exclude<TileStatus, "idle">, string> = {
  correct: "bg-primary text-primary-foreground border-primary",
  present: "bg-chart-2 text-foreground border-chart-2",
  absent: "bg-muted-foreground text-foreground border-muted-foreground",
};

export default function Tile({
  letter,
  status = "idle",
  index = 0,
}: {
  letter: string;
  status?: TileStatus;
  index?: number;
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
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [status, index, animate, scope]);

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
