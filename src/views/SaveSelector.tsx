import { invoke } from "@tauri-apps/api/core";
import DragAndDrop from "../components/DragAndDrop";
import { useEffect, useState } from "preact/hooks";
import { FolderIcon } from "@heroicons/react/20/solid";

type SaveFile = {
  name: string;
  path: string;
  size: string;
};

export default function SaveSelector() {
  const [saveFiles, setSaveFiles] = useState<SaveFile[]>([]);

  useEffect(() => {
    // On startup, find all save files and list them for easy selection
    invoke<SaveFile[]>("find_save_files").then((files) => {
      setSaveFiles(files);
    });
  }, []);

  return (
    <>
      <DragAndDrop className="mr-1.5 bg-red-500!" onFile={() => {}} />
      <div className="mt-1 text-center select-none text-zinc-300 text-[0.85rem]">
        Or, select a save file from below
      </div>
      <div className="mt-1.5 overflow-y-auto overflow-x-hidden pr-1.5 space-y-2">
        {saveFiles.map((file) => {
          return (
            <div
              class="flex items-center justify-between p-1 hover:cursor-pointer bg-zinc-700 rounded hover:bg-zinc-600 group"
              title={file.path}
            >
              <div className="flex justify-between w-full items-center">
                <FolderIcon class="inline w-6 h-6 shrink-0 text-zinc-400 ml-0.5 mt-0.5 mr-1.5" />
                <div className="grow text-sm font-medium text-zinc-200 truncate">
                  {file.name}
                </div>
                <div className="text-sm text-zinc-400 pl-1 shrink-0">
                  {file.size}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
