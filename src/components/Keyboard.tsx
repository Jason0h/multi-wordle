import { TileStatus } from "@/types";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const KEY_COLORS: Record<Exclude<TileStatus, "idle">, string> = {
  correct: "bg-chart-2 text-white dark:text-black border-chart-2",
  present: "bg-primary text-white dark:text-black border-primary",
  absent:
    "bg-muted-foreground text-white dark:text-black border-muted-foreground",
};

const STATUS_PRIORITY: Record<TileStatus, number> = {
  idle: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

function deriveKeyStatuses(
  board: string[][],
  feedback: TileStatus[][],
): Record<string, TileStatus> {
  const statuses: Record<string, TileStatus> = {};
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const letter = board[row][col];
      const status = feedback[row][col];
      if (!letter || status === "idle") continue;
      const current = statuses[letter] ?? "idle";
      if (STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        statuses[letter] = status;
      }
    }
  }
  return statuses;
}

export default function Keyboard({
  board,
  feedback,
}: {
  board: string[][];
  feedback: TileStatus[][];
}) {
  const keyStatuses = deriveKeyStatuses(board, feedback);

  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const status = keyStatuses[key];
            const colorClasses =
              status && status !== "idle"
                ? KEY_COLORS[status]
                : "bg-background border-border";
            return (
              <div
                key={key}
                className={`flex h-14 w-11 items-center justify-center rounded border-2 text-base font-bold ${colorClasses}`}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
