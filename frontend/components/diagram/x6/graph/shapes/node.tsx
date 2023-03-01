import type X6Type from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { useEffect, useRef, useState } from "react";
import { ClassNode } from "types";

function ShapeNode({ node, graph }: { node?: X6Type.Node; graph: X6Type.Graph }) {
   const [selected, setSelected] = useState<boolean>(false);

   const [type, setType] = useState<ClassNode["type"]>("class");
   const [packageName, setPackageName] = useState<ClassNode["package"]>();
   const [className, setClassName] = useState<ClassNode["name"]>();
   const [variables, setVariables] = useState<ClassNode["variables"]>([]);
   const [methods, setMethods] = useState<ClassNode["methods"]>([]);
   const [backgroundColor, setBackgroundColor] = useState("FFFFFF");
   const [borderColor, setBorderColor] = useState("000000");
   const [borderWidth, setBorderWidth] = useState(1);
   const [borderStyle, setBorderStyle] = useState("solid");

   const borderWidthRef = useRef(1);

   useEffect(() => {
      borderWidthRef.current = borderWidth;
   }, [borderWidth]);

   useEffect(() => {
      if (!node) {
         return;
      }

      const {
         type,
         package: packageName,
         name: className,
         variables,
         methods,
         backgroundColor,
         borderColor,
         borderWidth,
         borderStyle,
      } = node.getProp() as ClassNode;

      setSelected(graph?.isSelected(node));
      setType(type);
      setPackageName(packageName);
      setClassName(className);
      setVariables(variables || []);
      setMethods(methods || []);
      setBackgroundColor(backgroundColor || "FFFFFF");
      setBorderColor(borderColor || "000000");
      setBorderWidth(borderWidth || 1);
      setBorderStyle(borderStyle || "solid");
   }, []);

   useEffect(() => {
      graph?.on("node:selected", () => {
         const selectedNodes = graph.getSelectedCells();
         const isSelected = selectedNodes.some((selectedNode) => selectedNode.id === node?.id);
         setSelected(isSelected);
      });

      graph?.on("node:unselected", () => {
         const selectedNodes = graph.getSelectedCells();
         const isSelected = selectedNodes.some((selectedNode) => selectedNode.id === node?.id);
         setSelected(isSelected);
      });

      node?.on("change:package", ({ package: packageName, ws }: { package: ClassNode["package"]; ws: boolean }) => {
         if (packageName === "") {
            packageName = "default";
         }

         setPackageName(packageName);
         node
            .prop("package", packageName, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the class name is changed, update the node
      node?.on("change:className", ({ name, ws }: { name: ClassNode["name"]; ws: boolean }) => {
         if (name === "") {
            name = "ClassName";
         }

         setClassName(name);
         node.prop("name", name, { silent: true }).model.graph.trigger("node:change:data", { cell: node, options: { ws } });
         node?.model.graph.trigger("node:change:className"); // This is for updating the left panel
      });

      // if the class type is changed, update the node
      node?.on(
         "change:classType",
         ({ type, newHeight, ws }: { type: ClassNode["type"]; newHeight: number; ws: boolean }) => {
            setType(type);
            node
               .prop("type", type, { silent: true })
               .resize(node.size().width, newHeight || node.size().height)
               .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
         },
      );

      // if the variables are changed, update the node
      node?.on(
         "change:variables",
         ({ variables, newHeight, ws }: { variables: ClassNode["variables"]; newHeight: number; ws: boolean }) => {
            setVariables(variables);
            node
               .prop("variables", [...variables], { silent: true })
               .resize(node.size().width, newHeight || node.size().height)
               .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
         },
      );

      // if the methods are changed, update the node
      node?.on(
         "change:methods",
         ({ methods, newHeight, ws }: { methods: ClassNode["methods"]; newHeight: number; ws: boolean }) => {
            setMethods(methods);
            node
               .prop("methods", [...methods], { silent: true })
               .resize(node.size().width, newHeight || node.size().height)
               .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
         },
      );

      // if the background color is changed, update the node
      node?.on("change:backgroundColor", ({ backgroundColor, ws }: { backgroundColor: string; ws: boolean }) => {
         console.log("Changing background color", backgroundColor);
         setBackgroundColor(backgroundColor);
         node
            .prop("backgroundColor", backgroundColor, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the border color is changed, update the node
      node?.on("change:borderColor", ({ borderColor, ws }: { borderColor: string; ws: boolean }) => {
         setBorderColor(borderColor);
         node
            .prop("borderColor", borderColor, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the border width is changed, update the node
      node?.on("change:borderWidth", ({ borderWidth, ws }: { borderWidth: number; ws: boolean }) => {
         const addHeight = (borderWidth - borderWidthRef.current) * 4;
         setBorderWidth(borderWidth);
         node
            .prop("borderWidth", borderWidth, { silent: true })
            .resize(node.size().width, node.size().height + addHeight)
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // if the border style is changed, update the node
      node?.on("change:borderStyle", ({ borderStyle, ws }: { borderStyle: string; ws: boolean }) => {
         setBorderStyle(borderStyle);
         node
            .prop("borderStyle", borderStyle, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      node?.on("change:lockPosition", ({ lockPosition, ws }: { lockPosition: boolean; ws: boolean }) => {
         node
            .prop("lockPosition", lockPosition, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      node?.on("change:lockSize", ({ lockSize, ws }: { lockSize: boolean; ws: boolean }) => {
         node
            .prop("lockSize", lockSize, { silent: true })
            .model.graph.trigger("node:change:data", { cell: node, options: { ws } });
      });

      // turn off the event listeners when the component unmounts
      return () => {
         node?.off("change:className");
         node?.off("change:classType");
         node?.off("change:variables");
         node?.off("change:methods");
         node?.off("change:position");
         node?.off("change:size");
         node?.off("change:backgroundColor");
         node?.off("change:borderColor");
         node?.off("change:borderWidth");
         node?.off("change:borderStyle");
         node?.off("change:lockPosition");
         node?.off("change:lockSize");
      };
   }, [node]);

   // All the useEffects below are to trigger the graph to update the node
   useEffect(() => {
      node.prop("name", className, { silent: true }); // This is for updating the node on the graph
   }, [className]);

   useEffect(() => {
      node.prop("type", type, { silent: true });
   }, [type]);

   useEffect(() => {
      node.prop("variables", [...variables], { silent: true });
   }, [variables]);

   useEffect(() => {
      node.prop("methods", [...methods], { silent: true });
   }, [methods]);

   useEffect(() => {
      node.prop("backgroundColor", backgroundColor, { silent: true });
   }, [backgroundColor]);

   useEffect(() => {
      node.prop("borderColor", borderColor, { silent: true });
   }, [borderColor]);

   useEffect(() => {
      node.prop("borderWidth", borderWidth, { silent: true });
   }, [borderWidth]);

   useEffect(() => {
      node.prop("borderStyle", borderStyle, { silent: true });
   }, [borderStyle]);

   return (
      <>
         {selected && (
            <div
               style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "2px dashed #05a8ff",
                  zIndex: 100,
               }}
            />
         )}
         <div
            style={{
               fontFamily: "Helvetica",
               fontSize: 12,
               display: "flex",
               flexDirection: "column",
               width: "100%",
               height: "100%",
               backgroundColor: `#${backgroundColor}`,
               border: `${borderWidth}px ${borderStyle} #${borderColor}`,
               overflow: "hidden",
            }}
         >
            <div
               style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "4px 0",
                  borderBottom: variables || methods ? `${borderWidth}px ${borderStyle} #${borderColor}` : undefined,
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
                  {type === "abstract" ? (
                     <i>{!className ? "ClassName" : className}</i>
                  ) : !className ? (
                     "ClassName"
                  ) : (
                     className
                  )}
               </div>
            </div>

            {/* show the class variables if they exist */}
            {variables.length > 0 && (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     padding: "8px",
                     borderBottom: methods.length > 0 ? `${borderWidth}px ${borderStyle} #${borderColor}` : undefined,
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
                           (variable.type === "String" &&
                           // If the quotes are already there, don't add them again
                           !(variable.value.charAt(0) === '"' && variable.value.charAt(variable.value.length - 1) === '"')
                              ? ` = "${variable.value}"`
                              : ` = ${variable.value}`)}
                     </div>
                  ))}
               </div>
            )}

            {/* show the class methods if they exist */}
            {methods.length > 0 && (
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
      </>
   );
}

register({
   shape: "custom-class",
   component: ShapeNode,
   zIndex: 10,
   ports: {
      groups: {
         group1: {
            attrs: {
               circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#31d0c6",
                  strokeWidth: 2,
                  fill: "#fff",
                  style: {
                     visibility: "hidden",
                  },
               },
            },
            position: {
               name: "absolute",
            },
         },
      },
   },
});
