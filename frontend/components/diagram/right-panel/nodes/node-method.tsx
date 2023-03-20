import { cn } from "@/lib/utils";
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
   const accessModifierOptions = [
      { value: "public", label: "public (+)", symbol: "+" },
      { value: "protected", label: "protected (#)", symbol: "#" },
      { value: "private", label: "private (-)", symbol: "-" },
   ];
   const [showAccessModifierDropdown, setShowAccessModifierDropdown] = useState(false);
   const accessModifierDropdownRef = useRef<HTMLDivElement>(null);
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

   // scroll to parameters with offset when showParameters is true
   useEffect(() => {
      if (showParameters && parametersRef.current) {
         parametersRef.current.scrollIntoView({
            behavior: "smooth",
         });
      }
   }, [showParameters]);

   useEffect(() => {
      if (parameters.length === 0) {
         setShowParameters(false);
      }
   }, [parameters]);

   // if outside of the access modifier dropdown is clicked or if the user scrolls, close the dropdown
   useEffect(() => {
      function handleClickOrScrollOutside(event) {
         if (accessModifierDropdownRef.current && !accessModifierDropdownRef.current.contains(event.target)) {
            setShowAccessModifierDropdown(false);
         }
      }

      document.addEventListener("mousedown", handleClickOrScrollOutside);
      document.addEventListener("scroll", handleClickOrScrollOutside, true);

      return () => {
         document.removeEventListener("mousedown", handleClickOrScrollOutside);
         document.removeEventListener("scroll", handleClickOrScrollOutside, true);
      };
   }, [accessModifierDropdownRef]);

   return (
      <div>
         {/* list all of the different methods on different lines */}
         <div className="flex gap-2">
            <div className="flex mb-0.5">
               {/* access modifier dropdown input */}
               <div ref={accessModifierDropdownRef}>
                  <div
                     className="justify-center items-center flex w-6 mr-1 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     onClick={() => setShowAccessModifierDropdown(!showAccessModifierDropdown)}
                  >
                     <div className="text-xs w-3 pl-1.5">
                        {
                           // get the access modifier symbol from the accessModifierOptions array
                           accessModifierOptions.find((option) => option.value === accessModifier).symbol
                        }
                     </div>
                     <div>
                        <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" className="cursor-pointer">
                           <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                     </div>
                  </div>
                  {showAccessModifierDropdown && (
                     <div className="absolute mt-0.5 right-30 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {accessModifierOptions.map((option) => (
                           <button
                              key={option.value}
                              className="transform hover:bg-slate-200 transition duration-500 w-full h-7 flex items-center rounded-md text-xs pr-1"
                              onClick={() => {
                                 // update the node's methods array
                                 // @ts-ignore
                                 methods[index].accessModifier = option.value;
                                 node.trigger("change:methods", { current: methods });
                                 setAccessModifier(methods[index].accessModifier);
                              }}
                           >
                              {/* if this option is currently selected put a checkmark next to it */}
                              <div className="w-6 pl-1">
                                 {accessModifier === option.value && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 25 25">
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 )}
                              </div>
                              <div className="justify-left">{option.label}</div>
                           </button>
                        ))}
                     </div>
                  )}
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
                        node.trigger("change:methods", { current: methods });
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
                     node.trigger("change:methods", { current: methods });
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
               <div className="flex items-center ml-1  relative">
                  <div className="text-xs">(</div>
                  <div
                     className={cn(
                        "justify-center items-center flex w-10 h-3 rounded-md border  focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        parameters.length === 0
                           ? "border-2 border-dotted bg-slate-100 border-slate-400 h-[1.625rem] pl-1"
                           : "bg-slate-200 border-slate-300 h-[1.625rem] pl-0.5",
                     )}
                     onClick={() => setShowParameters(!showParameters)}
                  >
                     <div className="text-xs w-3 pl-1.5">
                        {/* show the amount of parameters */}
                        {parameters.length}
                     </div>
                     <div className="pl-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" focusable="false" className="cursor-pointer">
                           <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
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
                        node.trigger("change:methods", { current: newMethods, newHeight: newHeight });
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
                        className="p-2 transform transition duration-500 hover:scale-[1.6] flex justify-center items-center"
                        onClick={() => {
                           // add the new parameter to the method's parameters array
                           const paramsTemp = [...parameters];
                           const newMethods = [...methods];
                           paramsTemp.push({ name: `param${parameters.length + 1}`, type: "int" });
                           newMethods[index].parameters = paramsTemp;
                           node.trigger("change:methods", { current: newMethods });
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
