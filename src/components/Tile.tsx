export default function Tile({ letter }: { letter: string }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center border-2 border-border text-2xl font-bold uppercase">
      {letter}
    </div>
  );
}
