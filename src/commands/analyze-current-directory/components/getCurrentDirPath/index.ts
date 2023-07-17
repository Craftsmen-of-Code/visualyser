import { workspace } from "vscode";

export const getCurrentDirPath = (): string | undefined => {
  return workspace.workspaceFolders?.[0]?.uri.fsPath;
};
