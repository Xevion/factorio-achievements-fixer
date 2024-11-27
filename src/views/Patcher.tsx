import { useEffect, useState } from "preact/hooks";

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
    <div className="max-w-[600px] flex flex-col">
      <div className="rounded-xl bg-black/40 px-3.5 py-2 shadow-lg mb-2.5">
        <p className="text-sm text-zinc-300 select-none">{filename}</p>
        <p className="flex justify-end  overflow-hidden text-xs text-zinc-400">
          {path}
        </p>
      </div>

      <button
        type="button"
        style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.42)" }}
        class="text-white bg-emerald-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center drop-shadow-"
      >
        Patch
      </button>
    </div>
  );
}
