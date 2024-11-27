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

export default function DragAndDrop({ className, onFile }: DragAndDropProps) {
  const [hoverState, setIsHovering] = useState<
    | {
        state: "off" | "valid";
      }
    | {
        state: "invalid";
        detail: string;
      }
  >({ state: "off" });

  async function isValid(
    paths: string[]
  ): Promise<{ valid: true } | { valid: false; detail: string }> {
    if (paths.length !== 1) return { valid: false, detail: "Only one file" };
    if (!paths[0].endsWith(".zip"))
      return { valid: false, detail: "Not a .zip file" };
    if (!(await exists(paths[0])))
      return { valid: false, detail: "File does not exist" };
    return { valid: true };
  }

  useEffect(() => {
    const unlistenDrop = listen<DragDropEvent & { type: "drop" }>(
      "tauri://drag-drop",
      async (event) => {
        setIsHovering({ state: "off" });
        if (await isValid(event.payload.paths)) {
          onFile(event.payload.paths[0]);
        }
      }
    ).then((fn) => fn);

    const unlistenEnter = listen<DragDropEvent & { type: "enter" }>(
      "tauri://drag-enter",
      async (event) => {
        const result = await isValid(event.payload.paths);
        if (result.valid) setIsHovering({ state: "valid" });
        else setIsHovering({ state: "invalid", detail: result.detail });
      }
    ).then((fn) => fn);

    const unlistenLeave = listen("tauri://drag-leave", () => {
      setIsHovering({ state: "off" });
    }).then((fn) => fn);

    return () => {
      Promise.all([unlistenDrop, unlistenEnter, unlistenLeave]).then(
        (results) => {
          console.log("DragAndDrop listeners removed.", results);
        }
      );
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
          name: "Factorio Save File",
          extensions: ["zip"],
        },
      ],
    });

    if (selectedFile !== null && (await exists(selectedFile))) {
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
            "hover:bg-zinc-800  hover:border-zinc-500":
              hoverState.state === "off",
            "bg-zinc-800 border-zinc-500": hoverState.state === "valid",
            "bg-red-800/25 border-red-700/25 cursor-not-allowed":
              hoverState.state === "invalid",
          }
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <FolderArrowDownIcon className="w-8 h-8 mb-4 text-zinc-400" />
          {hoverState.state !== "invalid" ? (
            <>
              <p className="mb-2 text-sm text-zinc-400">
                <span className="font-semibold">Click to select</span> or drag
                and drop a save file
              </p>
              <p className="text-xs text-zinc-400">
                <Monoblock>.zip</Monoblock> files only
              </p>
            </>
          ) : (
            <p className="text-sm text-red-400">{hoverState.detail}</p>
          )}
        </div>
      </label>
    </div>
  );
}
