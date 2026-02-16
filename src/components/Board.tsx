import { RefObject } from "react";
import Row from "./Row";
import { TileStatus } from "@/types";

export default function Board({
  board,
  feedback,
  currentRow,
  currentRowRef,
  rtl = false,
}: {
  board: string[][];
  feedback: TileStatus[][];
  currentRow: number;
  currentRowRef: RefObject<HTMLDivElement | null>;
  rtl?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {board.map((row, index) => (
        <Row
          key={index}
          ref={index === currentRow ? currentRowRef : undefined}
          letters={row}
          feedback={feedback[index]}
          won={feedback[index].every((s) => s === "correct")}
          rtl={rtl}
        />
      ))}
    </div>
  );
}
