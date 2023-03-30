import type X6Type from "@antv/x6";
import { useEffect, useState, useRef } from "react";
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
   const accessModifierOptions = [
      { value: "private", label: "private (-)", symbol: "-" },
      { value: "protected", label: "protected (#)", symbol: "#" },
      { value: "public", label: "public (+)", symbol: "+" },
   ];
   const [showAccessModifierDropdown, setShowAccessModifierDropdown] = useState(false);
   const accessModifierDropdownRef = useRef(null);
   const [name, setName] = useState(variable.name || "");
   const [type, setType] = useState(variable.type || "");
   const [value, setValue] = useState(variable.value || "");

   // update the node's variables array
   useEffect(() => {
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

   // update the state when the variable prop changes
   useEffect(() => {
      setAccessModifier(variable.accessModifier);
      setName(variable.name || "");
      setType(variable.type || "");
      setValue(variable.value || "");
   }, [variable]);

   // if outside of the dropdown is clicked or if the user scrolls, close the dropdown
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
         {/* list all of the different variables on different lines */}
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
                        {accessModifierOptions.map((option, modifierIndex) => (
                           <button
                              key={option.value}
                              className="transform hover:bg-slate-200 transition duration-500 w-full h-7 flex items-center rounded-md text-xs pr-1"
                              onClick={() => {
                                 // update the node's variables array
                                 // @ts-ignore
                                 variables[index].accessModifier = option.value;
                                 node.trigger("change:variables", { current: variables });
                                 setAccessModifier(variables[index].accessModifier);

                                 // don't show the dropdown anymore
                                 setShowAccessModifierDropdown(false);
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
                        node.trigger("change:variables", { current: variables });
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
                     node.trigger("change:variables", { current: variables });
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
                     node.trigger("change:variables", { current: variables });
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
                        node.trigger("change:variables", { current: newVariables, newHeight: newHeight });
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
      </div>
   );
}
