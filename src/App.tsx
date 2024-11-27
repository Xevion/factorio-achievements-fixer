import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import DragAndDrop from "./components/DragAndDrop";
import { useEffect, useState } from "preact/hooks";
import { FolderIcon } from "@heroicons/react/20/solid";

type SaveFile = {
  name: string;
  path: string;
  size: string;
};

function App() {
  const [saveFiles, setSaveFiles] = useState<SaveFile[]>([]);

  useEffect(() => {
    // On startup, find all save files and list them for easy selection
    invoke<SaveFile[]>("find_save_files").then((files) => {
      setSaveFiles(files);
    });
  }, []);

  return (
    <main class="h-[100vh] w-[100vw] bg-zinc-800 p-4">
      <DragAndDrop className="mr-1.5 bg-red-500!" onFile={() => {}} />
      <div className="max-h-[50vh] mt-2.5 overflow-y-auto pr-1.5">
        {saveFiles.map((file) => {
          return (
            <div
              class="flex items-center justify-between p-1 bg-zinc-700 rounded-lg mb-2 hover:bg-zinc-600 group"
              title={file.path}
            >
              <div class="flex items-center">
                <FolderIcon class="w-6 h-6 text-zinc-400 ml-0.5 mt-0.5 mr-1.5" />
                <div>
                  <p class="text-zinc-400">
                    <span class="text-sm font-semibold text-zinc-100">
                      {file.name}
                    </span>
                    {"  "}
                    <span className="text-sm">({file.size})</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
