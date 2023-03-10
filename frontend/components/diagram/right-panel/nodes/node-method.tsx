import type X6Type from "@antv/x6";
import { useEffect, useState, useRef } from "react";
import { ClassNode } from "types";
import NodeSettingsParameter from "./node-parameter";

export default function NodeSettingsMethod({
   node,
   methods,
   method,
   index,
   setMethods,
   setMethodsMaxHeight,
}: {
   node: X6Type.Node;
   methods: ClassNode["methods"];
   method: ClassNode["methods"][0];
   index: number;
   setMethods: React.Dispatch<React.SetStateAction<ClassNode["methods"]>>;
   setMethodsMaxHeight: React.Dispatch<React.SetStateAction<number>>;
}) {
   const [accessModifier, setAccessModifier] = useState(method.accessModifier);
   const [name, setName] = useState(method.name || "");
   const [type, setType] = useState(method.type || "");
   const [parameters, setParameters] = useState(method.parameters || []);
   const [showParameters, setShowParameters] = useState(false);
   const parametersRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // update the node's methods array
      const newMethods = [...methods];
      newMethods[index] = {
         ...method,
         accessModifier,
         name,
         type,
         parameters,
      };
      setMethods(newMethods);
   }, [accessModifier, name, type, parameters]);

   useEffect(() => {
      setAccessModifier(method.accessModifier);
      setName(method.name || "");
      setType(method.type || "");
      setParameters(method.parameters || []);
   }, [method]);

   useEffect(() => {
      // if (index === methods.length - 1) {
      //    setMethodsMaxHeight(showParameters && parameters.length !== 0 ? parameters.length * 1.75 + 10 : 10);
      // } else {
      //    setMethodsMaxHeight(showParameters && parameters.length !== 0 ? parameters.length * 1.75 + 7 : 7);
      // }
      setMethodsMaxHeight(showParameters && parameters.length !== 0 ? parameters.length * 1.75 + 7 : 7);
      // index
   }, [parameters, showParameters]);

   // scroll to parameters when showParameters is true
   useEffect(() => {
      if (showParameters && parametersRef.current) {
         parametersRef.current.scrollIntoView({ behavior: "smooth" });
      }
   }, [showParameters]);

   useEffect(() => {
      if (parameters.length === 0) {
         setShowParameters(false);
      }
   }, [parameters]);

   return (
      <div>
         {/* list all of the different methods on different lines */}
         <div className="flex gap-2">
            <div className="flex mb-0.5">
               {/* access modifier dropdown input */}
               <div className="w-6 mr-1">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-1 select-none text-xs">
                        {accessModifier === "private"
                           ? "-"
                           : accessModifier === "public"
                           ? "+"
                           : accessModifier === "protected"
                           ? "#"
                           : "+"}
                     </div>
                     <select
                        value={accessModifier}
                        className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400 pl-6"
                        onChange={(e) => {
                           // update the node's method array
                           // @ts-ignore
                           methods[index].accessModifier = e.target.value;
                           node.trigger("change:methods", { methods });
                           setAccessModifier(methods[index].accessModifier);
                        }}
                     >
                        <option value="private">private (-)</option>
                        <option value="public">public (+)</option>
                        <option value="protected">protected (#)</option>
                     </select>
                  </div>
               </div>

               {/* method type text input */}
               <div className="w-12 mr-1">
                  <input
                     value={type}
                     className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     type="text"
                     onChange={(e) => {
                        // update the node's methods array
                        setType(e.target.value);
                        methods[index].type = e.target.value;
                        node.trigger("change:methods", { methods });
                     }}
                     // if the input is "Untitled" highlight the entire text
                     onFocus={(e) => {
                        if (e.target.value === "Untitled") {
                           e.target.select();
                        }
                     }}
                     // if the input is empty after clicking out of the input field, set the name to "Untitled"
                     onBlur={(e) => {}}
                  />
               </div>
               {/* method name input */}
               <input
                  value={name}
                  className="w-16 text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setName(e.target.value);
                     methods[index].name = e.target.value;
                     node.trigger("change:methods", { methods });
                  }}
                  // if the input is "Untitled" highlight the entire text
                  onFocus={(e) => {
                     if (e.target.value === "Untitled") {
                        e.target.select();
                     }
                  }}
                  // if the input is empty after clicking out of the input field, set the name to "Untitled"
                  onBlur={(e) => {}}
               />

               {/* method parameters dropdown button */}
               <div className="flex items-center ml-0.5 relative">
                  <div className="text-xs">(</div>
                  <div className="w-10">
                     <div className="relative">
                        <select
                           className={`w-full text-xs cursor-pointer text-center block rounded-md border focus:outline-none hover:border-slate-400 focus:border-slate-400 ${
                              parameters.length === 0
                                 ? "border-2 border-dotted bg-slate-100 border-slate-400 h-[1.625rem] pl-1"
                                 : "bg-slate-200 border-slate-300 h-[1.625rem] pl-0.5"
                           }`}
                           onClick={() => setShowParameters(!showParameters)}
                           onMouseDown={(e) => e.preventDefault()} // Stop the dropdown from opening
                        >
                           <option>{parameters.length}</option>
                        </select>
                     </div>
                  </div>
                  <div className="text-xs">)</div>
               </div>

               {/* delete button to delete the method */}
               <div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-md hover:cursor-pointer">
                  <div
                     className="mt-1 p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        // update the node's variables array
                        const newMethods = [...methods];
                        newMethods.splice(index, 1);

                        const newHeight = node.prop("size").height - (newMethods.length === 0 ? 36 : 20);
                        node.trigger("change:methods", { methods: newMethods, newHeight: newHeight });
                     }}
                  >
                     <span
                        role="button"
                        className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                     >
                        {/* trash can svg */}
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g strokeWidth="0"></g>
                           <g strokeLinecap="round" strokeLinejoin="round"></g>
                           <g>
                              <path
                                 d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                           </g>
                        </svg>
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* method parameters appearing section */}
         {showParameters && (
            <div
               ref={parametersRef}
               className="border border-slate-400 bg-slate-100 mt-0.5 mb-1 py-1 px-2 rounded-md drop-shadow-md items-center"
            >
               <div className="flex justify-between mb-1">
                  <div className="font-bold">Parameters</div>

                  {/* add button to add a new method to the selected node */}
                  <div className="pr-2 flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                     <div
                        className="p-2 transform transition duration-500 hover:scale-150 flex justify-center items-center"
                        onClick={() => {
                           // add the new parameter to the method's parameters array
                           const paramsTemp = [...parameters];
                           const newMethods = [...methods];
                           paramsTemp.push({ name: `param${parameters.length + 1}`, type: "int" });
                           newMethods[index].parameters = paramsTemp;
                           node.trigger("change:methods", { methods: newMethods });
                           setParameters(newMethods[index].parameters);

                           // Scroll to the bottom of the parameters list
                           parametersRef.current.scrollTop = parametersRef.current.scrollHeight;
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
               {parameters?.map((parameter, paramIndex) => {
                  return (
                     <NodeSettingsParameter
                        key={`${node.id}-${index}-${paramIndex}`}
                        index={paramIndex}
                        parameter={parameter}
                        node={node}
                        parameters={parameters}
                        setParameters={setParameters}
                        method={method}
                        methodIndex={index}
                        methods={methods}
                     />
                  );
               })}
            </div>
         )}
      </div>
   );
}
