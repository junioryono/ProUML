import type X6Type from "@antv/x6";
import type { ClassNode } from "types";
import JSZip from "jszip";

// We will be putting all the files in one ZIP file
export default async function DownloadJavaSkeleton(diagramName: string, cells: X6Type.Cell[]) {
   // Get all the nodes from the graph
   const nodes = cells.filter((cell) => {
      return cell.isNode();
   }) as X6Type.Node[];

   // Get all the edges from the graph
   const edges = cells.filter((cell) => {
      return cell.isEdge();
   }) as X6Type.Edge[];

   const files = nodes.map((node) => {
      const { package: packageName, name, type, variables, methods } = node.getProp() as ClassNode;

      let code = "";

      if (packageName && packageName !== "default") {
         code += `package ${packageName};\n\n`;
      }

      code += `public class ${name} `;

      // An abstract class can extend another class and implement interfaces
      // An interface can extend multiple interfaces (not implement)
      // A regular class can extend another class and implement interfaces

      const extendsNodes = edges.filter((edge) => {
         const sourceId = edge.getSourceCellId();
         if (sourceId !== node.id) {
            return false;
         }

         const target = edge.getTargetCell();
         if (!target) {
            return false;
         }

         const targetNode = target as X6Type.Node;
         const targetNodeProp = targetNode.getProp();
         if (!targetNodeProp) {
            return false;
         }

         return targetNodeProp.type === "abstract" && edge.getProp("edgeType") === "generalization";
      });

      const implementsNodes = edges.filter((edge) => {
         const sourceId = edge.getSourceCellId();
         if (sourceId !== node.id) {
            return false;
         }

         const target = edge.getTargetCell();
         if (!target) {
            return false;
         }

         const targetNode = target as X6Type.Node;
         const targetNodeProp = targetNode.getProp();
         if (!targetNodeProp) {
            return false;
         }

         console.log("targetNodeProp", targetNodeProp, edge.getProp("edgeType"));
         return targetNodeProp.type === "interface" && edge.getProp("edgeType") === "realization";
      });

      console.log("name", name);
      console.log("type", type);
      console.log("extendsNodes", extendsNodes);
      console.log("implementsNodes", implementsNodes);
      if (!type || type === "abstract") {
         if (extendsNodes.length > 0) {
            code += `extends `;
            code += extendsNodes
               .map((edge) => {
                  const target = edge.getTargetCell() as X6Type.Node;
                  return target.getProp("name");
               })
               .join(", ");

            code += " ";
         }

         if (implementsNodes.length > 0) {
            code += `implements `;
            code += implementsNodes
               .map((edge) => {
                  const target = edge.getTargetCell() as X6Type.Node;
                  return target.getProp("name");
               })
               .join(", ");

            code += " ";
         }
      } else if (type === "interface") {
         if (extendsNodes.length > 0) {
            code += `extends `;
            code += extendsNodes
               .map((edge) => {
                  const target = edge.getTargetCell() as X6Type.Node;
                  return target.getProp("name");
               })
               .join(", ");

            code += " ";
         }
      }

      code += "{\n";

      code += variables
         .map((variable) => {
            let string = `    ${variable.accessModifier || "public"} `;

            if (variable.static) {
               string += "static ";
            }

            if (variable.final) {
               string += "final ";
            }

            string += `${variable.type} ${variable.name}`;

            if (variable.value) {
               if (
                  variable.type === "String" &&
                  !(variable.value.charAt(0) === '"' && variable.value.charAt(variable.value.length - 1) === '"')
               ) {
                  string += ` = "${variable.value}"`;
               } else {
                  string += ` = ${variable.value}`;
               }
            }

            string += ";";

            return string;
         })
         .join("\n");

      code += "\n\n";

      code += methods
         .map((method) => {
            let string = `    ${method.accessModifier || "public"} `;

            if (method.static) {
               string += "static ";
            }

            if (method.final) {
               string += "final ";
            }

            if (method.type) {
               string += `${method.type} `;
            }

            string += `${method.name}(`;

            string += method.parameters
               .map((parameter) => {
                  return `${parameter.type} ${parameter.name}`;
               })
               .join(", ");

            string += ")";

            if (method.abstract) {
               string += ";";
            } else {
               string += " {\n        // TODO: Implement this method\n    }";
            }

            return string;
         })
         .join("\n");

      code += "\n}";

      return {
         name: `${name}.java`,
         code: code.trim(),
      };
   });

   // Create a new instance of JSZip
   const zip = new JSZip();

   // Create a folder called 'src' inside the ZIP
   const srcFolder = zip.folder("src");

   for (const file of files) {
      srcFolder.file(file.name, file.code);
   }

   // Generate the ZIP file as a Blob
   const content = await zip.generateAsync({ type: "blob" });

   // Create an anchor element with a download attribute
   const downloadLink = document.createElement("a");
   downloadLink.href = URL.createObjectURL(content);
   downloadLink.download = `${diagramName}.zip`;

   // Append the link to the DOM, click it, and remove it
   document.body.appendChild(downloadLink);
   downloadLink.click();
   document.body.removeChild(downloadLink);

   // Release the object URL after the download is complete
   setTimeout(() => {
      URL.revokeObjectURL(downloadLink.href);
   }, 100);
}
