const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export default function Keyboard() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => (
            <div
              key={key}
              className="flex h-14 w-11 items-center justify-center rounded bg-background border-2 border-border text-base font-bold"
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
