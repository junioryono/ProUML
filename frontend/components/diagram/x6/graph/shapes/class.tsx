import { cn } from "@/lib/utils";
import { Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { useEffect, useState } from "react";
import { ClassNode, AccessModifier } from "types";

const enum ClassSection {
   Name,
   Variables,
   Methods,
}

function ShapeClass({ node }: { node?: Node }) {
   // Need to include types
   const { package: packageName, name: className, variables, methods } = node.getProp() as ClassNode;

   const [selectedSection, setSelectedSection] = useState<ClassSection>();
   const [font, setFont] = useState("Helvetica");
   const [fontSize, setFontSize] = useState(12);
   // const [width, setWidth] = useState(0);
   // const [height, setHeight] = useState(0);

   // useEffect(() => {
   //    const { dontDetectSize } = node.getProp();
   //    if (!dontDetectSize) {
   //       console.log("Detecting size");
   //       const { width, height } = detectClassSize(node);
   //       // node.resize(width, height);
   //    }
   // }, []);

   useEffect(() => {
      console.log("package", packageName);
      console.log("name", className);
      console.log("variables", variables);
      console.log("methods", methods);
   }, []);

   return (
      <div
         style={{
            fontFamily: font,
            fontSize: `${fontSize}px`,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            border: "1px solid black",
         }}
      >
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: "4px 0",
               borderBottom: "1px solid black",
               fontWeight: "bold",
            }}
         >
            {/* for the name of the class */}
            <div>{!className ? "ClassName" : className}</div>
         </div>

         {/* show the class variables if they exist */}
         {variables && (
            <div
               style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px",
                  borderBottom: methods ? "1px solid black" : undefined,
               }}
            >
               {variables.map((variable, index) => (
                  <div key={index}>
                     {variable.accessModifier
                        ? variable.accessModifier === "protected"
                           ? "#"
                           : variable.accessModifier === "private"
                           ? "-"
                           : "+"
                        : "+"}
                     {variable.name}: {variable.type}
                     {/* if there is a variable value, show it */}
                     {variable.value &&
                        // if the value is a string, add quotes, if not show as it is
                        (typeof variable.value === "string" ? ` = "${variable.value}"` : ` = variable.value`)}
                  </div>
               ))}
            </div>
         )}

         {/* show the class methods if they exist */}
         {methods && (
            <div
               style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "8px",
               }}
            >
               {methods.map((method, index) => (
                  <div key={index}>
                     {method.accessModifier
                        ? method.accessModifier === "protected"
                           ? "#"
                           : method.accessModifier === "private"
                           ? "-"
                           : "+"
                        : "+"}
                     {method.name}
                     &#40;
                     {method.parameters
                        .map((parameter) => {
                           return `${parameter.name}: ${parameter.type}`;
                        })
                        .join(", ")}
                     &#41;: {method.type}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}

register({
   shape: "custom-class",
   component: ShapeClass,
});
