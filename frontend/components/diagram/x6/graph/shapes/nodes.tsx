import type X6Type from "@antv/x6";
import { register } from "@antv/x6-react-shape";
import { useEffect, useState } from "react";
import { ClassNode } from "types";

function ShapeNodeClass({ node }: { node: X6Type.Node }) {
   const [selected, setSelected] = useState<boolean>(false);

   const [type, setType] = useState<ClassNode["type"]>("class");
   const [packageName, setPackageName] = useState<ClassNode["package"]>();
   const [name, setName] = useState<ClassNode["name"]>();
   const [variables, setVariables] = useState<ClassNode["variables"]>([]);
   const [methods, setMethods] = useState<ClassNode["methods"]>([]);
   const [backgroundColor, setBackgroundColor] = useState("FFFFFF");
   const [borderColor, setBorderColor] = useState("000000");
   const [borderWidth, setBorderWidth] = useState(1);
   const [borderStyle, setBorderStyle] = useState("solid");

   useEffect(() => {
      if (!node) {
         return;
      }

      const {
         type,
         package: packageName,
         name,
         variables,
         methods,
         backgroundColor,
         borderColor,
         borderWidth,
         borderStyle,
      } = node.getProp() as ClassNode;

      setType(type);
      setPackageName(packageName);
      setName(name);
      setVariables(variables || []);
      setMethods(methods || []);
      setBackgroundColor(backgroundColor || "FFFFFF");
      setBorderColor(borderColor || "000000");
      setBorderWidth(borderWidth || 1);
      setBorderStyle(borderStyle || "solid");
   }, []);

   useEffect(() => {
      node?.on("selected", (args) => {
         setSelected(true);
      });

      node?.on("unselected", (args) => {
         setSelected(false);
      });

      node?.on("change:package", ({ current, ws }: { current: ClassNode["package"]; ws: boolean }) => {
         if (current === "") {
            current = "default";
         }

         setPackageName(current);
         node.prop("package", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "package",
            cell: node,
            options: { ws },
         });
      });

      // if the class name is changed, update the node
      node?.on("change:name", ({ current, ws }: { current: ClassNode["name"]; ws: boolean }) => {
         if (current === "") {
            current = "ClassName";
         }

         setName(current);
         node.prop("name", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "name",
            cell: node,
            options: { ws },
         });

         node?.model.graph.trigger("node:change:name"); // This is for updating the left panel
      });

      // if the class type is changed, update the node
      node?.on(
         "change:type",
         ({ current, newHeight, ws }: { current: ClassNode["type"]; newHeight: number; ws: boolean }) => {
            setType(current);
            node.batchUpdate("update", () => {
               node.resize(node.size().width, newHeight || node.size().height);
               node.prop("type", current, { silent: true });
               node.model.graph.model.graph.trigger("node:change:data", {
                  key: "type",
                  cell: node,
                  options: { ws },
               });
               node.model.graph.trigger("node:change:type", {
                  cell: node,
                  type: current,
               });
            });
         },
      );

      // if the variables are changed, update the node
      node?.on(
         "change:variables",
         ({ current, newHeight, ws }: { current: ClassNode["variables"]; newHeight: number; ws: boolean }) => {
            setVariables(current);
            node.batchUpdate("update", () => {
               node.resize(node.size().width, newHeight || node.size().height);
               node.prop("variables", [...current], { silent: true });
               node.model.graph.model.graph.trigger("node:change:data", {
                  key: "variables",
                  cell: node,
                  options: { ws },
               });
            });
         },
      );

      // if the methods are changed, update the node
      node?.on(
         "change:methods",
         ({ current, newHeight, ws }: { current: ClassNode["methods"]; newHeight: number; ws: boolean }) => {
            setMethods(current);
            node.batchUpdate("update", () => {
               node.resize(node.size().width, newHeight || node.size().height);
               node.prop("methods", [...current], { silent: true });
               node.model.graph.model.graph.trigger("node:change:data", {
                  key: "methods",
                  cell: node,
                  options: { ws },
               });
            });
         },
      );

      // if the background color is changed, update the node
      node?.on("change:backgroundColor", ({ current, ws }: { current: string; ws: boolean }) => {
         setBackgroundColor(current);
         node.prop("backgroundColor", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "backgroundColor",
            cell: node,
            options: { ws },
         });
      });

      // if the border color is changed, update the node
      node?.on("change:borderColor", ({ current, ws }: { current: string; ws: boolean }) => {
         setBorderColor(current);
         node.prop("borderColor", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "borderColor",
            cell: node,
            options: { ws },
         });
      });

      // if the border width is changed, update the node
      node?.on("change:borderWidth", ({ current, newHeight, ws }: { current: number; newHeight: number; ws: boolean }) => {
         setBorderWidth(current);
         node.batchUpdate("update", () => {
            node.resize(node.size().width, newHeight || node.size().height);
            node.prop("borderWidth", current, { silent: true });
            node.model.graph.model.graph.trigger("node:change:data", {
               key: "borderWidth",
               cell: node,
               options: { ws },
            });
         });
      });

      // if the border style is changed, update the node
      node?.on("change:borderStyle", ({ current, ws }: { current: string; ws: boolean }) => {
         setBorderStyle(current);
         node.prop("borderStyle", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "borderStyle",
            cell: node,
            options: { ws },
         });
      });

      node?.on("change:lock", ({ current, ws }: { current: boolean; ws: boolean }) => {
         node.prop("lock", current, { silent: true }).model.graph.trigger("node:change:data", {
            key: "lock",
            cell: node,
            options: { ws },
         });
      });

      node?.on("resize", () => {
         setSelected(false);
      });

      node?.on("resized", () => {
         setSelected(true);
      });

      // turn off the event listeners when the component unmounts
      return () => {
         node?.off("change:name");
         node?.off("change:type");
         node?.off("change:variables");
         node?.off("change:methods");
         node?.off("change:position");
         node?.off("change:size");
         node?.off("change:backgroundColor");
         node?.off("change:borderColor");
         node?.off("change:borderWidth");
         node?.off("change:borderStyle");
         node?.off("change:lock");
         node?.off("resize");
         node?.off("resized");
      };
   }, [node]);

   // All the useEffects below are to trigger the graph to update the node
   useEffect(() => {
      node.prop("type", type, { silent: true });
   }, [type]);

   useEffect(() => {
      node.prop("packageName", packageName, { silent: true });
   }, [packageName]);

   useEffect(() => {
      node.prop("name", name, { silent: true });
   }, [name]);

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
      <div
         style={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            borderWidth: 0,
            borderStyle: "solid",
            borderColor: "#e5e7eb",
            lineHeight: "1.25rem",
         }}
      >
         {selected && (
            <div
               className="user-cell-selection"
               style={{
                  position: "absolute",
                  top: -2.5,
                  left: -2.5,
                  width: node.size().width + 5,
                  height: node.size().height + 5,
                  border: "2px solid #05a8ff",
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
               justifyContent: "flex-start",
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
                  width: "100%",
                  borderBottom:
                     variables.length > 0 || methods.length > 0
                        ? `${borderWidth}px ${borderStyle} #${borderColor}`
                        : undefined,
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
                  {type === "abstract" ? <i>{!name ? "ClassName" : name}</i> : !name ? "ClassName" : name}
               </div>
            </div>

            {/* show the class variables if they exist */}
            {variables.length > 0 && (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     padding: "8px",
                     width: "100%",
                     borderBottom: methods.length > 0 ? `${borderWidth}px ${borderStyle} #${borderColor}` : undefined,
                  }}
               >
                  {variables.map((variable, index) => (
                     <div key={index}>
                        {variable.accessModifier === "protected" ? "#" : variable.accessModifier === "private" ? "-" : "+"}
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
                           ?.map((parameter, index) => {
                              if (!parameter.type && !parameter.name) {
                                 return `param${index + 1}`;
                              }

                              if (!parameter.type) {
                                 return parameter.name;
                              }

                              if (!parameter.name) {
                                 return parameter.type;
                              }

                              return `${parameter.name}: ${parameter.type}`;
                           })
                           .join(", ")}
                        &#41;{method.type && `: ${method.type}`}
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}

register({
   shape: "custom-class",
   component: ShapeNodeClass,
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
            zIndex: 1,
            position: {
               name: "absolute",
            },
         },
      },
   },
});

export default ShapeNodeClass;
