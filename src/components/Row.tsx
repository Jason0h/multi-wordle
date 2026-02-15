import { Ref } from "react";
import Tile from "./Tile";
import { TileStatus } from "@/types";

export default function Row({
  letters,
  feedback,
  won = false,
  ref,
}: {
  letters: string[];
  feedback: TileStatus[];
  won?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className="flex gap-2">
      {letters.map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          status={feedback[index]}
          index={index}
          won={won}
        />
      ))}
    </div>
  );
}
