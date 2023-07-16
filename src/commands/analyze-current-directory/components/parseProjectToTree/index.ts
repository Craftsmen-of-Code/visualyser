import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import * as babel from "@babel/parser";
import traverse from "@babel/traverse";

interface ComponentNode {
  name: string;
  path: string;
  props: string[];
  state: string[];
  children: ComponentNode[];
}

export const parseProjectToTree = async (
  dir: string
): Promise<ComponentNode[]> => {
  const files = await glob("**/*.{js,jsx,ts,tsx}", {
    cwd: dir,
    ignore: ["node_modules/**"],
    maxDepth: Infinity,
  });

  const components: ComponentNode[] = [];

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

    const ast = babel.parse(fileContent, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    const componentNode: ComponentNode = {
      name: "",
      path: file,
      props: [],
      state: [],
      children: [],
    };

    traverse(ast, {
      FunctionDeclaration(path) {
        if (path.node.id) {
          componentNode.name = path.node.id.name;
        }
      },
      FunctionExpression(path) {
        if (
          path.parent.type === "VariableDeclarator" &&
          path.parent.id.type === "Identifier"
        ) {
          componentNode.name = path.parent.id.name;
        }
      },
      ClassDeclaration(path) {
        if (path.node.id) {
          componentNode.name = path.node.id.name;
        }

        const stateProperty = path.node.body.body.find((node) => {
          // @ts-ignore
          return node.type === "ClassProperty" && node.key.name === "state";
        });

        // @ts-ignore
        if (stateProperty && stateProperty.value.type === "ObjectExpression") {
          // @ts-ignore
          for (const prop of stateProperty.value.properties) {
            if (prop.key.type === "Identifier") {
              componentNode.state.push(prop.key.name);
            }
          }
        }
      },
      ClassExpression(path) {
        if (
          path.parent.type === "VariableDeclarator" &&
          path.parent.id.type === "Identifier"
        ) {
          componentNode.name = path.parent.id.name;
        }

        const stateProperty = path.node.body.body.find((node) => {
          // @ts-ignore
          return node.type === "ClassProperty" && node.key.name === "state";
        });

        // @ts-ignore
        if (stateProperty && stateProperty.value.type === "ObjectExpression") {
          // @ts-ignore
          for (const prop of stateProperty.value?.properties) {
            if (prop.key.type === "Identifier") {
              componentNode.state.push(prop.key.name);
            }
          }
        }
      },
      CallExpression(path) {
        if (
          path.node.callee.type === "Identifier" &&
          path.node.callee.name === "useState"
        ) {
          // @ts-ignore
          const stateVariable = path.parent.id;

          if (stateVariable.type === "ArrayPattern") {
            for (const element of stateVariable.elements) {
              if (element.type === "Identifier") {
                componentNode.state.push(element.name);
              }
              break;
            }
          } else if (stateVariable.type === "Identifier") {
            componentNode.state.push(stateVariable.name);
          }
        }
      },
    });

    components.push(componentNode);
  }

  const componentMap = new Map<string, ComponentNode>();

  for (const component of components) {
    componentMap.set(component.path, component);
  }

  for (const component of components) {
    const parentPath = path.dirname(component.path);
    const parent = componentMap.get(parentPath);

    if (parent) {
      parent.children.push(component);
    }
  }

  return components.filter((component) => {
    const parentPath = path.dirname(component.path);
    const parent = componentMap.get(parentPath);

    if (parent) {
      return false;
    }

    return true;
  });
};
