import { ExtensionContext } from "vscode";
import { VisualyserUIPanel } from "../../../../panels/VisualyserUIPanel";

export const displayParsedTree = (context: ExtensionContext, data: any) => {
  VisualyserUIPanel.render(context.extensionUri);
};
