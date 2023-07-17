import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { Tree } from "../../../../types/Tree";
import { Parser } from "./Parser";

export const parseProjectToTree = async (
  dir: string
): Promise<Tree | undefined> => {
  const files = await glob("**/*.{js,jsx,ts,tsx}", {
    cwd: dir,
    ignore: ["node_modules/**"],
    maxDepth: Infinity,
  });

  // const components: ComponentNode[] = [];
  const filesWithReactCode: string[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileContent = await fs.promises.readFile(filePath, "utf-8");

    if (
      !/<\w+(?:[^>]*?)>(?:[^<]*?)<\/\w+>|<\w+(?:[^/>]*?)\/>/.test(
        fileContent
      ) &&
      !/import\s+\{?\s*\w+\s*\}?\s+from\s+['"]react['"]/gi.test(fileContent)
    ) {
      continue;
    }

    filesWithReactCode.push(filePath);
  }

  if (!filesWithReactCode.length) {
    return;
  }

  const entryPoint: string | undefined =
    filesWithReactCode.find((file) => file.includes("index")) ||
    filesWithReactCode.find((file) => file.includes("main")) ||
    filesWithReactCode.find((file) => file.includes("App"));

  if (!entryPoint) {
    throw new Error("No entry point found");
  }

  return new Parser(entryPoint).parse();
};
