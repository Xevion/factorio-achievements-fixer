import { useEffect, useState } from "preact/hooks";
import { exists } from "@tauri-apps/plugin-fs";
import { listen } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderArrowDownIcon } from "@heroicons/react/24/outline";
import { cn } from "../utils";
import { invoke } from "@tauri-apps/api/core";
import Monoblock from "./Monoblock";
import { DragDropEvent } from "@tauri-apps/api/webview";

interface DragAndDropProps {
  className?: string;
  onFile: (path: string) => void;
}

type HoverState = "off" | "valid" | "invalid";

export default function DragAndDrop({ className, onFile }: DragAndDropProps) {
  const [isHovering, setIsHovering] = useState<HoverState>("off");

  async function isValid(paths: string[]): Promise<boolean> {
    console.log({ paths });
    return paths.length === 1 && paths[0].endsWith(".zip") && exists(paths[0]);
  }

  useEffect(() => {
    const unlistenEnter = listen<DragDropEvent & { type: "enter" }>(
      "tauri://drag-enter",
      async (event) => {
        if (await isValid(event.payload.paths)) setIsHovering("valid");
        else setIsHovering("invalid");
      }
    ).then((fn) => fn);

    const unlistenLeave = listen("tauri://drag-leave", () => {
      setIsHovering("off");
    }).then((fn) => fn);

    return () => {
      unlistenEnter.then(() => {});
      unlistenLeave.then(() => {});
    };
  });

  async function onClick() {
    const defaultPath = await invoke<string>("choose_best_save_directory");

    const selectedFile = await open({
      defaultPath: defaultPath ?? "",
      multiple: false,
      directory: false,
      canCreateDirectories: false,
      recursive: false,
      title: "Select a save file",
      filters: [
        {
          name: "ZIP Archive",
          extensions: ["zip"],
        },
      ],
    });

    if (selectedFile !== null) {
      onFile(selectedFile);
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(className, "flex items-center justify-center w-full")}
    >
      <label
        className={cn(
          "flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer  bg-zinc-700 border-zinc-600",
          {
            "hover:bg-zinc-800  hover:border-zinc-500": isHovering === "off",
            "bg-zinc-800 border-zinc-500": isHovering === "valid",
            "bg-red-800/25 border-red-700/25": isHovering === "invalid",
          }
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FolderArrowDownIcon className="w-8 h-8 mb-4 text-zinc-500 dark:text-zinc-400" />
          <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold">Click to select</span> or drag and
            drop a save file
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            <Monoblock>.zip</Monoblock> files only
          </p>
        </div>
      </label>
    </div>
  );
}
