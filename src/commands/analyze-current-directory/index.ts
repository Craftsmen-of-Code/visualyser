import { ExtensionContext, window, ProgressLocation } from "vscode";
import { getCurrentDirPath } from "./components/getCurrentDirPath";
import { validatePackageJson } from "./components/validatePackageJson";
import { parseProjectToTree } from "./components/parseProjectToTree";
import { displayParsedTree } from "./components/displayParsedTree";

export const analyzeCurrentDirectoryHandler = async (
  context: ExtensionContext
) => {
  try {
    const currentDir = getCurrentDirPath();
    if (currentDir) {
      await window.withProgress(
        {
          location: ProgressLocation.Notification,
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

          progress.report({ message: "Displaying parsed data..." });
          displayParsedTree(context, parsedData);
        }
      );
    } else {
      window.showErrorMessage("No workspace folder found");
    }
  } catch (error: any) {
    console.log(error);
    window.showErrorMessage(error.message);
  }
};
