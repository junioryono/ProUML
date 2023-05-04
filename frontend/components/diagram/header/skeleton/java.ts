import type X6Type from "@antv/x6";
import type { ClassNode } from "types";
import JSZip from "jszip";

// We will be putting all the files in one ZIP file
export default async function DownloadJavaSkeleton(diagramName: string, cells: X6Type.Cell[]) {
   // Get all the nodes from the graph
   const nodes = cells.filter((cell) => {
      return cell.isNode();
   });

   // Get all the edges from the graph
   const edges = cells.filter((cell) => {
      return cell.isEdge();
   });

   const files = nodes.map((node) => {
      const { package: packageName, name, type, variables, methods } = node.getProp() as ClassNode;

      let code = "";

      if (packageName && packageName !== "default") {
         code += `package ${packageName};\n\n`;
      }

      code += `public class ${name} `;

      if (type === "abstract") {
         code += "extends ";
      } else if (type === "interface") {
         code += "implements ";
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
            return `    ${method.type} ${method.name}() {}`;
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
