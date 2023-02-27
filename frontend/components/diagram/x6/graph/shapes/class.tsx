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
   const [type, setType] = useState<ClassNode["type"]>("class");
   const [packageName, setPackageName] = useState<ClassNode["package"]>();
   const [className, setClassName] = useState<ClassNode["name"]>();
   const [variables, setVariables] = useState<ClassNode["variables"]>([]);
   const [methods, setMethods] = useState<ClassNode["methods"]>([]);

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
      if (!node) {
         return;
      }

      const { type, package: packageName, name: className, variables, methods } = node.getProp() as ClassNode;

      setType(type);
      setPackageName(packageName);
      setClassName(className);
      setVariables(variables);
      setMethods(methods);
   }, []);

   useEffect(() => {
      if (!node) {
         return;
      }

      // if the class name is changed, update the node
      node.on("change:className", ({ name, ws }: { name: ClassNode["name"]; ws: boolean }) => {
         setClassName(name);
         node.prop("name", name, { silent: true }).model.graph.trigger("node:change:data", { cell: node, options: { ws } });
         node.model.graph.trigger("node:change:className"); // This is for updating the left panel
      });

      // if the class type is changed, update the node
      node.on("change:classType", ({ type, ws }: { type: ClassNode["type"]; ws: boolean }) => {
         setType(type);
         node.prop("type", type, { silent: true }).model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the variables are changed, update the node
      node.on("change:variables", ({ variables, ws }: { variables: ClassNode["variables"]; ws: boolean }) => {
         setVariables(variables);
         node
            .prop("variables", [...variables], { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the methods are changed, update the node
      node.on("change:methods", ({ methods, ws }: { methods: ClassNode["methods"]; ws: boolean }) => {
         setMethods(methods);
         node
            .prop("methods", [...methods], { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // turn off the event listeners when the component unmounts
      return () => {
         node.off("change:className");
         node.off("change:classType");
         node.off("change:variables");
         node.off("change:methods");
         node.off("change:position");
         node.off("change:size");
      };
   }, [node]);

   // update the node when the class name changes
   useEffect(() => {
      node.prop("name", className, { silent: true }); // This is for updating the node on the graph
   }, [className]);

   // update the node when the class type changes
   useEffect(() => {
      node.prop("type", type, { silent: true });
   }, [type]);

   // update the node when the variables change
   useEffect(() => {
      node.prop("variables", [...variables], { silent: true });
   }, [variables]);

   // update the node when the methods change
   useEffect(() => {
      node.prop("methods", [...methods], { silent: true });
   }, [methods]);

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
            overflow: "hidden",
         }}
      >
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               alignItems: "center",
               padding: "4px 0",
               borderBottom: variables || methods ? "1px solid black" : undefined,
            }}
         >
            {(type === "interface" || type === "enum") && (
               <div
                  style={{
                     height: "17px",
                  }}
               >{`<<${type}>>`}</div>
            )}
            <div
               style={{
                  fontWeight: "bold",
               }}
            >
               {/* if the class is abstract, it's classname should be italicized */}
               {type === "abstract" ? <i>{!className ? "ClassName" : className}</i> : !className ? "ClassName" : className}
            </div>
         </div>

         {/* show the class variables if they exist */}
         {variables && variables.length > 0 && (
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
                     {variable.name}
                     {variable.type && `: ${variable.type}`}
                     {variable.value &&
                        // if the value is a string, add quotes
                        (variable.type === "String" ? ` = "${variable.value}"` : ` = ${variable.value}`)}
                  </div>
               ))}
            </div>
         )}

         {/* show the class methods if they exist */}
         {methods && methods.length > 0 && (
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
                        ?.map((parameter) => {
                           return `${parameter.name}: ${parameter.type}`;
                        })
                        .join(", ")}
                     &#41;{method.type && `: ${method.type}`}
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
