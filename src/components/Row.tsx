import { Ref } from "react";
import Tile from "./Tile";

export default function Row({
  letters,
  ref,
}: {
  letters: string[];
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className="flex gap-2">
      {letters.map((letter, index) => (
        <Tile key={index} letter={letter} />
      ))}
    </div>
  );
}
