import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import { Tree } from "../../src/types/Tree";
import ReactJson from "react-json-view";

function App() {
  const [loading, setLoading] = useState(true);
  const [treeData, setTreeData] = useState<Tree | null>(null);

  useEffect(() => {
    const vscode = (window as any).acquireVsCodeApi();

    window.addEventListener("message", (event) => {
      const message = event.data;
      switch (message.command) {
        case "tree-data": {
          setTreeData(message.data as Tree);
          setLoading(false);
          break;
        }
        default: {
          alert("Unknown message type received in webview");
          break;
        }
      }
    });

    let loadingTimeout = setTimeout(() => {
      vscode.postMessage({
        command: "ready",
      });
      clearTimeout(loadingTimeout);
    }, 2000);
  }, []);

  return (
    <div>
      {loading ? (
        <div className="loader-container">
          <VSCodeProgressRing />
        </div>
      ) : (
        <ReactJson src={treeData!} theme="chalk" collapsed={1} />
      )}
    </div>
  );
}

export default App;
