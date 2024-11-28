import { cn } from "../utils";

export default function Logs() {
  const data = [
    {
      type: "info",
      message: "Starting patcher...",
    },
    {
      type: "warning",
      message: "Checking for updates...",
    },
    {
      type: "info",
      message: "No updates found.",
    },
    {
      type: "error",
      message: "Patching...",
    },
    {
      type: "info",
      message: "Patching complete.",
    },
  ];

  return (
    <div className="bg-black/40 py-2.5 rounded">
      <p className="text-xs font-medium px-2.5 border-b border-zinc-700 pb-1 text-zinc-300">
        Logs
      </p>

      <div className="flex flex-col space-y-1 mt-1 text-zinc-400">
        {data.map((log) => {
          return (
            <p
              className={cn("text-xs w-full px-2.5 hover:bg-black/45", {
                "text-emerald-400/90": log.type === "warning",
                "text-rose-400/90": log.type === "error",
              })}
            >
              {log.message}
            </p>
          );
        })}
      </div>
    </div>
  );
}
