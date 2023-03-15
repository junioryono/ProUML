import type X6Type from "@antv/x6";
import { useEffect, useState } from "react";
import { ClassNode } from "types";

export default function NodeSettingsParameter({
   node,
   parameters,
   parameter,
   index,
   setParameters,
   method,
   methodIndex,
   methods,
}: {
   node: X6Type.Node;
   parameters: ClassNode["methods"][0]["parameters"];
   parameter: ClassNode["methods"][0]["parameters"][0];
   index: number;
   setParameters: React.Dispatch<React.SetStateAction<ClassNode["methods"][0]["parameters"]>>;
   method: ClassNode["methods"][0];
   methodIndex: number;
   methods: ClassNode["methods"];
}) {
   const [name, setName] = useState(parameter.name || "");
   const [type, setType] = useState(parameter.type || "");

   useEffect(() => {
      // update the node's variables array
      const newParameters = [...parameters];
      newParameters[index] = {
         ...parameter,
         name,
         type,
      };
      setParameters(newParameters);
   }, [name, type]);

   useEffect(() => {
      setName(parameter.name || "");
      setType(parameter.type || "");
   }, [parameter]);

   return (
      <div>
         {/* list all of the different variables on different lines */}
         <div className="flex">
            <div className="flex w-full mb-0.5 justify-between">
               <div className="flex">
                  {/* variable type text input */}
                  <div className="w-12 mr-1">
                     <input
                        value={type}
                        className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                        type="text"
                        onChange={(e) => {
                           setType(e.target.value);
                           methods[methodIndex].parameters[index].type = e.target.value;
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

                  {/* variable name input */}
                  <input
                     value={name}
                     className="w-16 text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     type="text"
                     onChange={(e) => {
                        setName(e.target.value);
                        methods[methodIndex].parameters[index].name = e.target.value;
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

               {/* delete button to delete the variable */}
               <div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-md hover:cursor-pointer">
                  <div
                     className="mt-1 p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        const newParameters = [...parameters];
                        newParameters.splice(index, 1);
                        setParameters(newParameters);
                        methods[methodIndex].parameters.splice(index, 1);
                        node.trigger("change:methods", { current: methods });
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
