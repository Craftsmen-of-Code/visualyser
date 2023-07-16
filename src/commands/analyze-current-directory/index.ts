import * as vscode from "vscode";
import { getCurrentDirPath } from "./components/getCurrentDirPath";
import { validatePackageJson } from "./components/validatePackageJson";
import { parseProjectToTree } from "./components/parseProjectToTree";
import { displayParsedTree } from "./components/displayParsedTree";

export const analyzeCurrentDirectoryHandler = async () => {
  try {
    const currentDir = getCurrentDirPath();
    if (currentDir) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Analyzing current directory",
          cancellable: false,
        },
        async (progress) => {
          progress.report({ message: "Reading current directory..." });

          const { redux, typescript } = await validatePackageJson(
            currentDir,
            progress
          );

          progress.report({ message: "Reading files..." });
          const parsedData = await parseProjectToTree(currentDir);
          console.log(parsedData);

          progress.report({ message: "Displaying parsed data..." });
          displayParsedTree(parsedData);
        }
      );
    } else {
      vscode.window.showErrorMessage("No workspace folder found");
    }
  } catch (error: any) {
    console.log(error);
    vscode.window.showErrorMessage(error.message);
  }
};
