import { Progress } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

export const validatePackageJson = async (
  currentDir: string,
  progress: Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
) => {
  const packageJsonExists = await glob("package.json", {
    cwd: currentDir,
    ignore: ["node_modules/**/*"],
    nodir: true,
    maxDepth: 1,
  }).then((files) => files.length > 0);

  if (!packageJsonExists) {
    throw new Error("No package.json found");
  }

  progress.report({ message: "Reading package.json..." });
  const packageJson = await fs.promises.readFile(
    path.join(currentDir, "package.json"),
    "utf-8"
  );

  const dependencies = Object.keys(JSON.parse(packageJson).dependencies);
  const devDependencies = Object.keys(JSON.parse(packageJson).devDependencies);

  if (!dependencies.includes("react")) {
    throw new Error("Looks like this project is not using React");
  }

  const redux: boolean = dependencies.includes("react-redux");

  const typescript: boolean = devDependencies.includes("typescript");

  return {
    redux,
    typescript,
  };
};
