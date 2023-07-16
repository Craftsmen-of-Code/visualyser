import * as vscode from "vscode";

export const getCurrentDirPath = (): string | undefined => {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
};
