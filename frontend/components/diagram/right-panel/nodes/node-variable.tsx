import type X6Type from "@antv/x6";
import { useEffect, useState } from "react";
import { ClassNode } from "types";

export default function NodeSettingsVariable({
   node,
   variables,
   variable,
   index,
   setVariables,
}: {
   node: X6Type.Node;
   variables: ClassNode["variables"];
   variable: ClassNode["variables"][0];
   index: number;
   setVariables: React.Dispatch<React.SetStateAction<ClassNode["variables"]>>;
}) {
   const [accessModifier, setAccessModifier] = useState(variable.accessModifier);
   const [name, setName] = useState(variable.name);
   const [type, setType] = useState(variable.type);
   const [value, setValue] = useState(variable.value);

   useEffect(() => {
      // update the node's variables array
      const newVariables = [...variables];
      newVariables[index] = {
         ...variable,
         accessModifier,
         name,
         type,
         value,
      };
      setVariables(newVariables);
   }, [accessModifier, name, type, value]);

   useEffect(() => {
      setAccessModifier(variable.accessModifier);
      setName(variable.name);
      setType(variable.type);
      setValue(variable.value);
   }, [variable]);

   return (
      <div>
         {/* list all of the different variables on different lines */}
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
                           : "-"}
                     </div>
                     <select
                        value={accessModifier}
                        className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400 pl-6"
                        onChange={(e) => {
                           // update the node's variables array
                           // @ts-ignore
                           variables[index].accessModifier = e.target.value;
                           node.trigger("change:variables", { variables });
                           setAccessModifier(variables[index].accessModifier);
                        }}
                     >
                        <option value="private">private (-)</option>
                        <option value="public">public (+)</option>
                        <option value="protected">protected (#)</option>
                     </select>
                  </div>
               </div>
               {/* variable type text input */}
               <div className="w-12 mr-1">
                  <input
                     value={type}
                     className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     type="text"
                     onChange={(e) => {
                        // update the node's variables array
                        setType(e.target.value);
                        variables[index].type = e.target.value;
                        console.log(variables[index].type);
                        node.trigger("change:variables", { variables });
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
               {/* variable name input */}
               <input
                  value={name}
                  className="w-16 text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setName(e.target.value);
                     variables[index].name = e.target.value;
                     node.trigger("change:variables", { variables });
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
               {/* variable value input */}
               <div className={`ml-0.5 mr-0.5 ${!value ? "text-slate-400" : "text-black"}`}>=</div>
               <input
                  value={value}
                  className={`w-10 text-center block rounded-md border text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400
                      ${
                         !value
                            ? "border-2 border-dotted bg-slate-100 border-slate-400 h-6.5"
                            : "bg-slate-200 border-slate-300 py-3 h-3"
                      }`}
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setValue(e.target.value);
                     variables[index].value = e.target.value;
                     node.trigger("change:variables", { variables });
                  }}
                  // if the input is "Untitled" highlight the entire text
                  onFocus={(e) => {
                     if (e.target.value === "Untitled") {
                        e.target.select();
                     }
                  }}
               />
               {/* delete button to delete the variable */}
               <div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-md hover:cursor-pointer">
                  <div
                     className="mt-1 p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        // update the node's variables array
                        const newVariables = [...variables];
                        newVariables.splice(index, 1);

                        const newHeight = node.prop("size").height - (newVariables.length === 0 ? 36 : 20);
                        node.trigger("change:variables", { variables: newVariables, newHeight: newHeight });
                     }}
                  >
                     <span
                        role="button"
                        className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                     >
                        {/* trash can svg */}
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
         </div>
      </div>
   );
}
