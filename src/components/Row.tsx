import Tile from "./Tile";

export default function Row({ letters }: { letters: string[] }) {
  return (
    <div className="flex gap-2">
      {letters.map((letter, index) => (
        <Tile key={index} letter={letter} />
      ))}
    </div>
  );
}
