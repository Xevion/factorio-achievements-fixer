import { useState } from "preact/hooks";
import "./App.css";
import SaveSelector from "./views/SaveSelector";
import Patcher from "./views/Patcher";

function App() {
  const [currentSave, setCurrentSave] = useState<string | null>(null);

  return (
    <main class="h-[100vh] w-[100vw] bg-zinc-800 px-3 py-2 flex flex-col">
      {currentSave === null ? (
        <SaveSelector
          onFile={(path) => {
            setCurrentSave(path);
          }}
        />
      ) : (
        <Patcher
          path={currentSave}
          onComplete={() => {
            setCurrentSave(null);
          }}
        />
      )}
    </main>
  );
}

export default App;
