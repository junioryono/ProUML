import { ScrollFade } from "@/components/scroll-fade";
import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import { ClassNode } from "types";
import NodeSettingsMethod from "./node-method";
import NodeSettingsVariable from "./node-variable";

// if only one node is selected, show the node settings
export default function NodeSettings({ node, graph }: { node: X6Type.Node; graph: MutableRefObject<X6Type.Graph> }) {
   // for the name of the node
   const [nodeName, setNodeName] = useState("");
   // for the class type of a class node
   const [classType, setClassType] = useState(node.getProp("type") as ClassNode["type"]);
   // for if the node is an interface or not
   const [isInterface, setIsInterface] = useState((node.getProp("type") as ClassNode["type"]) === "interface");
   // if if the node is an abstract class or not
   const [isAbstract, setIsAbstract] = useState((node.getProp("type") as ClassNode["type"]) === "abstract");
   // for the variables of a class node
   const [variables, setVariables] = useState((node.getProp("variables") as ClassNode["variables"]) || []);
   // for the methods of a class node
   const [methods, setMethods] = useState((node.getProp("methods") as ClassNode["methods"]) || []);
   // for the x position of a cell
   const [x, setX] = useState(node.getProp("position")?.x || node.getProp("x"));
   // for the y position of a cell
   const [y, setY] = useState(node.getProp("position")?.y || node.getProp("y"));
   // for the height of a cell
   const [height, setHeight] = useState(node.getProp("size")?.height || node.getProp("height"));
   // for the width of a cell
   const [width, setWidth] = useState(node.getProp("size")?.width || node.getProp("width"));
   // if selected cell position or size is currently locked or not
   const [positionLocked, setPositionLocked] = useState(false); // pos initially not locked
   const [sizeLocked, setSizeLocked] = useState(false); // size initially not locked

   // when the node changes, update the state information of the node
   useEffect(() => {
      // if the node is undefined, return
      if (!node) {
         return;
      }

      // get the properties of the node
      const props = node.prop();
      console.log("props", props);

      // update the state information of the node
      setNodeName(props.name);
      setVariables(props.variables);
      setMethods(props.methods);
      setHeight(props.size?.height || props.height);
      setWidth(props.size?.width || props.width);

      // re-render when the selected node changes
      node.on("change:className", (args) => {
         setNodeName(args.name);
      });

      // re-render when the node size changes
      node.on("change:size", (args) => {
         const size = args.cell.getProp("size");
         setWidth(size.width);
         setHeight(size.height);
      });

      // re-render when the node position changes
      node.on("change:position", (cell) => {
         setX(cell.current.x);
         setY(cell.current.y);
      });
   }, [node]);

   return (
      <>
         <div className="flex flex-col pb-3">
            {/* ---------------------- NODE NAME SECTION ---------------------- */}
            <div className="flex justify-between">
               <div className="font-bold mb-1.5">Node Settings</div>
            </div>
            <div className="flex items-center gap-2">
               <div className="items-center gap-2">
                  <div className="flex items-center mb-1.5">
                     <div className="w-1/4">Name</div>
                     <input
                        value={nodeName}
                        className="w-full ml-1 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-1 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                        type="text"
                        onChange={(e) => {
                           console.log(node.prop());

                           // set the name of the node
                           setNodeName(e.target.value);

                           // set the name of the node in the graph
                           node.trigger("change:className", { name: e.target.value });
                        }}
                        // if the input is "Untitled" highlight the entire text
                        onFocus={(e) => {
                           if (e.target.value === "Untitled") {
                              e.target.select();
                           }
                        }}
                        // if the input is empty after clicking out of the input field, set the name to "Untitled"
                        onBlur={(e) => {
                           if (e.target.value === "") {
                              setNodeName("Untitled");
                              node.prop("name", "Untitled");
                           }
                        }}
                     />

                     {/* delete button to delete the node */}
                     <div className="flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                        <div
                           className="p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                           onClick={() => {
                              // remove the node from the graph
                              graph.current.removeCell(node);
                           }}
                        >
                           <span
                              role="button"
                              className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                           >
                              {/* trash can svg */}
                              <svg
                                 width="20px"
                                 height="20px"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path
                                       d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                       stroke="#000000"
                                       stroke-width="1.5"
                                       stroke-linecap="round"
                                       stroke-linejoin="round"
                                    ></path>
                                 </g>
                              </svg>
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* ---------------------- NODE CLASS TYPE SECTION ---------------------- */}
                  <div className="flex items-center mb-1.5">
                     <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                           {/* if the class node is an interface */}
                           <input
                              type="checkbox"
                              id="is-interface"
                              className="w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                              checked={isInterface}
                              onChange={(e) => {
                                 setIsInterface(e.target.checked);
                                 node.trigger("change:type", { type: e.target.checked && "interface" });
                              }}
                           />
                           <label htmlFor="is-interface">Interface</label>

                           {/* if the class node is an abstract class */}
                           <input
                              type="checkbox"
                              id="is-abstract"
                              className="ml-4 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                              checked={isAbstract}
                              onChange={(e) => {
                                 setIsAbstract(e.target.checked);
                                 node.trigger("change:isAbstract", { isAbstract: e.target.checked });
                              }}
                           />
                           <label htmlFor="is-abstract">Abstract</label>
                        </div>
                     </div>
                  </div>

                  {/* ---------------------- NODE VARIABLES SECTION ---------------------- */}
                  <div className="flex flex-col">
                     <div className="flex justify-between mb-1">
                        <div className="font-bold">Variables</div>

                        {/* add button to add a new variable to the selected node */}
                        <div className="pr-2 flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                           <div
                              className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center"
                              onClick={() => {
                                 // get the selected cell and its variables
                                 const variablesTemp = [...variables];

                                 // add this new variable to the array of variables
                                 variablesTemp.push({
                                    type: "String",
                                    name: `variable${variablesTemp.length + 1}`,
                                    value: "value",
                                    // @ts-ignore
                                    accessModifier: "private",
                                 });

                                 setVariables(variablesTemp);
                                 node.trigger("change:variables", { variables: variablesTemp });

                                 const newHeight = height + (variablesTemp.length > 1 ? 20 : 36);
                                 node.resize(node.prop("size").width, newHeight);
                              }}
                           >
                              <span
                                 role="button"
                                 className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                              >
                                 <svg
                                    className="svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 12 12"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z"
                                       fillRule="nonzero"
                                       fillOpacity="1"
                                       fill="#000"
                                       stroke="none"
                                    />
                                 </svg>
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* map out all the variables in the selected cell */}
                     <div className="relative mb-1">
                        <ScrollFade maxHeight={90}>
                           <div className="max-h-28">
                              {variables.map((variable, index) => (
                                 <NodeSettingsVariable
                                    key={index}
                                    node={node}
                                    variables={variables}
                                    variable={variable}
                                    index={index}
                                    setVariables={setVariables}
                                 />
                              ))}
                           </div>
                        </ScrollFade>
                     </div>
                  </div>

                  {/* ---------------------- NODE METHODS SECTION ---------------------- */}
                  <div className="flex flex-col">
                     <div className="flex justify-between mb-1">
                        <div className="font-bold">Methods</div>

                        {/* add button to add a new method to the selected node */}
                        <div className="pr-2 flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                           <div
                              className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center"
                              onClick={() => {
                                 // get the selected cell and its variables
                                 const methodsTemp = [...methods];

                                 // add this new variable to the array of variables
                                 methodsTemp.push({
                                    type: "String",
                                    name: `method${methodsTemp.length + 1}`,
                                    parameters: [],

                                    // @ts-ignore
                                    accessModifier: "public",
                                 });

                                 setMethods(methodsTemp);
                                 node.trigger("change:methods", { methods: methodsTemp });

                                 const newHeight = height + (methodsTemp.length > 1 ? 20 : 36);
                                 node.resize(node.prop("size").width, newHeight);
                              }}
                           >
                              <span
                                 role="button"
                                 className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                              >
                                 <svg
                                    className="svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 12 12"
                                    xmlns="http://www.w3.org/2000/svg"
                                 >
                                    <path
                                       d="M5.5 5.5v-5h1v5h5v1h-5v5h-1v-5h-5v-1h5z"
                                       fillRule="nonzero"
                                       fillOpacity="1"
                                       fill="#000"
                                       stroke="none"
                                    />
                                 </svg>
                              </span>
                           </div>
                        </div>
                     </div>
                     {/* map out all the variables in the selected cell */}
                     <div className="relative mb-1">
                        <ScrollFade maxHeight={90}>
                           <div className="max-h-28">
                              {methods.map((method, index) => (
                                 <NodeSettingsMethod
                                    key={index}
                                    node={node}
                                    methods={methods}
                                    method={method}
                                    index={index}
                                    setMethods={setMethods}
                                 />
                              ))}
                           </div>
                        </ScrollFade>
                     </div>
                  </div>

                  <div className="flex justify-between">
                     {/* ---------------------- NODE POSITION SECTION ---------------------- */}
                     <div className="flex flex-col pt-1.5">
                        <div className="flex justify-between">
                           <div className="font-bold mb-1.5">Position</div>
                        </div>

                        <div className="items-center gap-3">
                           {/* x location input */}
                           <div className="flex items-center mb-1">
                              <div className="w-1/7">X</div>
                              <input
                                 value={x}
                                 className={`w-16 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    positionLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 autoCapitalize="none"
                                 autoComplete="both"
                                 autoCorrect="off"
                                 spellCheck="false"
                                 disabled={positionLocked}
                              />
                           </div>

                           {/* y location input */}
                           <div className="flex items-center">
                              <div className="w-1/7">Y</div>
                              <input
                                 value={y}
                                 className={`w-16 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    positionLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 autoCapitalize="none"
                                 autoComplete="both"
                                 autoCorrect="off"
                                 spellCheck="false"
                                 disabled={positionLocked}
                              />
                           </div>
                        </div>
                        <div className="flex mt-1.5">
                           <input
                              type="checkbox"
                              id="position-lock"
                              className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                              onChange={() => setPositionLocked(!positionLocked)}
                              checked={positionLocked}
                           />
                           <label htmlFor="position-lock">Lock pos</label>
                        </div>
                     </div>

                     {/* ---------------------- NODE SIZING SECTION ---------------------- */}
                     <div className="flex flex-col pt-1.5">
                        <div className="font-bold mb-1.5 justify-between">Sizing</div>
                        <div className="items-center gap-3">
                           {/* width input */}
                           <div className="flex items-center mb-1">
                              <div className="w-12">Width</div>
                              <input
                                 value={width}
                                 className={`w-16 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    sizeLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 disabled={sizeLocked}
                              />
                           </div>

                           {/* height input */}
                           <div className="flex items-center">
                              <div className="w-12">Height</div>
                              <input
                                 value={height}
                                 className={`w-16 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    sizeLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400 text-black"
                                 }`}
                                 type="text"
                                 disabled={sizeLocked}
                              />
                           </div>

                           <div className="flex mt-1.5">
                              <input
                                 type="checkbox"
                                 id="size-lock"
                                 className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                                 onChange={() => setSizeLocked(!sizeLocked)}
                                 checked={sizeLocked}
                              />
                              <label htmlFor="size-lock">Lock size</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <hr className="border-slate-400 pb-1.5" />
      </>
   );
}