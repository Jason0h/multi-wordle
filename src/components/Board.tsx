import { RefObject } from "react";
import Row from "./Row";

export default function Board({
  board,
  currentRow,
  currentRowRef,
}: {
  board: string[][];
  currentRow: number;
  currentRowRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex flex-col gap-2">
      {board.map((row, index) => (
        <Row
          key={index}
          ref={index === currentRow ? currentRowRef : undefined}
          letters={row}
        />
      ))}
    </div>
  );
}
