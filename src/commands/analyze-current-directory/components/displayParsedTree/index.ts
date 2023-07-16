import * as vscode from "vscode";
import { getWebviewContent } from "./getWebviewContent";

export const displayParsedTree = (data: any) => {
  const panel = vscode.window.createWebviewPanel(
    "visualyser",
    "Visualyser",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  panel.webview.html = getWebviewContent(data);
};
