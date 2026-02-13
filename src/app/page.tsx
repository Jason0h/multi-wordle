import Board from "@/components/Board";

const board = [
  ["H", "E", "L", "L", "O"],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Board board={board} />
    </div>
  );
}
