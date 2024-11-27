import { cn } from "../utils";

interface BytesProps {
  className?: string;
}

export default function Bytes({ className }: BytesProps) {
  const bytes = new Array(16 * 16).fill(0).map(() =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  );

  return (
    <div
      className={cn(
        "bg-black/40 pt-1.5 pb-2.5 rounded overflow-hidden",
        className
      )}
    >
      <p className="text-xs font-medium mx-2.5">Bytes</p>
      <p className="text-xs mx-3 pt-0.5 text-zinc-400">
        You can change the offset of the bytes modified in this menu if it
        doesn't work initially.
      </p>
      <div
        className={cn(
          "pt-2 grid grid-cols-16 font-mono mx-5 gap-1 text-center text-xs h-full overflow-y-scroll",
          className
        )}
      >
        {bytes.map((byte, index) => (
          <div
            key={index}
            className={cn("hover:bg-black/45", {
              "text-zinc-500":
                Math.random() < 0.9 || index < 50 || index > 16 * 10,
            })}
          >
            {byte}
          </div>
        ))}
      </div>
    </div>
  );
}