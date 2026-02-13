import Row from "./Row";

export default function Board({ board }: { board: string[][] }) {
  return (
    <div className="flex flex-col gap-2">
      {board.map((row, index) => (
        <Row key={index} letters={row} />
      ))}
    </div>
  );
}
