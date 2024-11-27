import { useEffect, useState } from "preact/hooks";
import Logs from "../components/Logs";
import Bytes from "../components/Bytes";

interface PatcherProps {
  className?: string;
  path: string;
  onComplete?: () => void;
}

export default function Patcher({ onComplete, path }: PatcherProps) {
  const [filename, setFilename] = useState<string | null>(null);

  async function setup() {
    const filename = path.split("\\").pop();
    if (filename) setFilename(filename.split(".")[0]);
  }
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") onComplete?.();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  async function teardown() {}

  useEffect(() => {
    setup();
    return () => {
      teardown();
    };
  }, []);

  return (
    <div className="flex flex-col justify-between h-full pb-2">
      <div className="space-y-3">
        <div className="rounded-lg bg-black/40 px-3.5 py-2 shadow-lg mb-2.5">
          <p className="text-sm text-zinc-300 select-none">{filename}</p>
          <p className="flex justify-end overflow-hidden text-xs text-zinc-400">
            {path}
          </p>
        </div>
        <Logs />
        <Bytes className="max-h-[300px]" />
      </div>
      <button
        type="button"
        style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.42)" }}
        class="text-white bg-emerald-500 font-medium rounded-lg text-sm py-2.5 text-center drop-shadow-"
      >
        Patch
      </button>
    </div>
  );
}
