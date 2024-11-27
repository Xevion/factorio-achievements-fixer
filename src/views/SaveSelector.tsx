import { invoke } from "@tauri-apps/api/core";
import DragAndDrop from "../components/DragAndDrop";
import { useEffect, useState } from "preact/hooks";
import { FolderIcon } from "@heroicons/react/20/solid";

type SaveFile = {
  name: string;
  path: string;
  size: string;
  last_modified: string;
};

interface SaveSelectorProps {
  onFile?: (path: string) => void;
}

export default function SaveSelector({ onFile }: SaveSelectorProps) {
  const [saveFiles, setSaveFiles] = useState<SaveFile[]>([]);

  useEffect(() => {
    // On startup, find all save files and list them for easy selection
    invoke<SaveFile[]>("find_save_files").then((files) => {
      console.log("Save Files Acquired", files);
      setSaveFiles(files);
    });
  }, []);

  function Item({ file, onClick }: { file: SaveFile; onClick: () => void }) {
    return (
      <div
        class="flex items-center justify-between p-1 hover:cursor-pointer bg-zinc-700 rounded hover:bg-zinc-600 group"
        title={file.path}
        onClick={onClick}
      >
        <div className="flex justify-between text-zinc-400 w-full items-center text-sm">
          <FolderIcon class="inline w-6 h-6 shrink-0 ml-0.5 mt-0.5 mr-1.5" />
          <div className="grow font-medium text-zinc-200 truncate">
            {file.name}
          </div>
          <div className="pl-1 shrink-0">{file.last_modified}</div>
          <span className="text-zinc-300">,</span>
          <div className="pl-1 shrink-0">{file.size}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DragAndDrop className="mr-1.5" onFile={onFile} />
      <div className="mt-1 text-center select-none text-zinc-300 text-[0.85rem]">
        Or, select a save file from below
      </div>
      <div className="mt-1.5 overflow-y-auto overflow-x-hidden pr-2 space-y-2">
        {saveFiles.map((file) => {
          return (
            <Item
              onClick={() => {
                onFile?.(file.path);
              }}
              file={file}
            />
          );
        })}
      </div>
    </>
  );
}
