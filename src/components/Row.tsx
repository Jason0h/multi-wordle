import { Ref } from "react";
import Tile from "./Tile";
import { TileStatus } from "@/types";

export default function Row({
  letters,
  feedback,
  won = false,
  rtl = false,
  ref,
}: {
  letters: string[];
  feedback: TileStatus[];
  won?: boolean;
  rtl?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} dir="ltr" className="flex gap-2">
      {letters.map((letter, index) => (
        <Tile
          key={index}
          letter={letter}
          status={feedback[index]}
          index={index}
          won={won}
          rtl={rtl}
        />
      ))}
    </div>
  );
}
