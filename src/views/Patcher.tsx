import { useEffect, useState } from "preact/hooks";

interface PatcherProps {
  className?: string;
  path: string;
}

export default function Patcher({ path }: PatcherProps) {
  const [filename, setFilename] = useState<string | null>(null);

  async function setup() {
    const filename = path.split("\\").pop();
    if (filename) setFilename(filename.split(".")[0]);
  }

  async function teardown() {}

  useEffect(() => {
    setup();
    return () => {
      teardown();
    };
  }, []);

  return (
    <div className="max-w-[600px]">
      <div className="rounded-xl bg-black/40 px-3.5 py-2">
        <p className="text-sm text-zinc-300">{filename}</p>
        <p className="flex justify-end  overflow-hidden text-xs text-zinc-400">
          {path}
        </p>
      </div>
    </div>
  );
}
