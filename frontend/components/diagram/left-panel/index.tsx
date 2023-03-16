import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Diagram } from "types";
import { toast } from "@/ui/toast";
import { createDiagram } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

export default function LeftPanel({ diagram, graph }: { diagram: Diagram; graph: MutableRefObject<X6Type.Graph> }) {
   const router = useRouter();

   const [nodes, setNodes] = useState<X6Type.Node[]>([]);
   const [edges, setEdges] = useState<X6Type.Edge[]>([]);
   const [selectedCells, setSelectedCells] = useState<X6Type.Cell[]>([]);

   // when the graph changes, update the nodes, edges, and selected cells
   useEffect(() => {
      setNodes(graph.current?.getNodes());
      setEdges(graph.current?.getEdges());
      setSelectedCells(graph.current?.getSelectedCells());

      graph.current?.on("node:added", () => {
         setNodes(graph.current?.getNodes());
      });

      graph.current?.on("node:removed", () => {
         setNodes(graph.current?.getNodes());
      });

      graph.current?.on("edge:added", () => {
         setEdges(graph.current?.getEdges());
      });

      graph.current?.on("edge:removed", () => {
         setEdges(graph.current?.getEdges());
      });

      graph.current?.on("cell:selected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });

      graph.current?.on("cell:unselected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });

      // Need to change node names in the left panel when the node name is changed in the graph
      graph.current?.on("node:change:name", () => {
         setNodes(graph.current?.getNodes());
      });
   }, [graph]);

   return (
      <div className="w-60 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar overflow-x-hidden p-2 flex flex-col border-gray-400 border-r-1 select-none cursor-default">
         {/* ---------------------- SEARCH BAR SECTION ---------------------- */}

         <div className="flex flex-col mt-2 mb-1">
            <div className="pr-2 flex items-center cursor-pointer content-center gap-1">
               <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M9.04 9.81c-.739.576-1.668.917-2.676.917C3.953 10.727 2 8.775 2 6.364 2 3.953 3.953 2 6.364 2c2.41 0 4.363 1.953 4.363 4.364 0 1.008-.342 1.937-.916 2.676l3.484 3.483-.772.771L9.04 9.811zm.596-3.446c0 1.807-1.465 3.272-3.272 3.272-1.808 0-3.273-1.465-3.273-3.272 0-1.808 1.465-3.273 3.273-3.273 1.807 0 3.272 1.465 3.272 3.273z"
                     fillRule="evenodd"
                     fillOpacity="1"
                     fill="#000"
                     stroke="none"
                  />
               </svg>
               <div className="bg-white">
                  <input
                     placeholder="Search.."
                     className="w-full my-0 block h-3 rounded-md border border-slate-300 py-3 px-3 text-xs placeholder:text-slate-400 hover:border-slate-400 focus:border-neutral-300 focus:outline-none"
                     type="text"
                     autoCapitalize="none"
                     autoComplete="both"
                     autoCorrect="off"
                     spellCheck="false"
                     onChange={(event) => {
                        const searchText = event.target.value.toLowerCase();
                        const elements = document.querySelectorAll(".searchable");
                        elements.forEach((element) => {
                           const text = element.textContent.toLowerCase();
                           if (text.includes(searchText)) {
                              //element.style.display = "block";
                           } else {
                              //element.style.display = "none";
                           }
                        });
                     }}
                  />
               </div>
            </div>
         </div>

         {/* ---------------------- DIAGRAMS SECTION ---------------------- */}
         {diagram.project && (
            <>
               <div className="pb-1">
                  <div className="mt-2 flex justify-between">
                     <div className="font-bold pb-1">Diagrams</div>
                     <div className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center">
                        <span
                           role="button"
                           className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                           onClick={() => {
                              const formData = new FormData();

                              formData.append("projectId", diagram.project.id);

                              createDiagram(formData)
                                 .then((res) => {
                                    if (res.success === false) {
                                       throw new Error(res.reason);
                                    }

                                    router.push(`/dashboard/diagrams/${res.response}`);

                                    return toast({
                                       title: "Success!",
                                       message: "Your diagram has been created. You will be redirected to the new diagram.",
                                       type: "success",
                                    });
                                 })
                                 .catch((error) => {
                                    console.error(error);
                                    return toast({
                                       title: "Something went wrong.",
                                       message: error.message,
                                       type: "error",
                                    });
                                 });
                           }}
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

                  {diagram.project.diagrams.map((pDiagram) => {
                     return (
                        <div
                           key={pDiagram.id}
                           className={cn(
                              "rounded flex items-center gap-3 py-1 pl-4 mb-0.5",
                              pDiagram.id === diagram.id && "bg-slate-300 font-semibold",
                              pDiagram.id !== diagram.id && "hover:bg-slate-200 cursor-pointer",
                           )}
                           onClick={() => {
                              if (pDiagram.id !== diagram.id) {
                                 router.push(`/dashboard/diagrams/${pDiagram.id}`);
                              }
                           }}
                        >
                           <div className="w-3"></div>
                           <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: "180px" }}>
                              {pDiagram.name}
                           </div>
                        </div>
                     );
                  })}
               </div>
               <hr className="border-slate-400" />
            </>
         )}

         {/* ---------------------- NODES SECTION ---------------------- */}
         <div className="pb-1">
            <div className="flex flex-col">
               <div className="flex justify-between mt-2">
                  <div className="font-bold mb-1">Nodes</div>

                  <div
                     className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        graph.current?.addNode({
                           shape: "custom-class",
                           x: 100,
                           y: 100,
                           size: {
                              width: 285,
                              height: 145,
                           },
                           package: "default",
                           name: "ClassName",
                           variables: [
                              {
                                 type: "String",
                                 name: "variable1",
                                 accessModifier: "private",
                                 static: true,
                              },
                              {
                                 type: "String",
                                 name: "variable2",
                                 accessModifier: "private",
                                 static: true,
                              },
                           ],
                           methods: [
                              {
                                 type: "void",
                                 name: "method1",
                                 accessModifier: "public",
                                 parameters: [
                                    {
                                       type: "String",
                                       name: "param1",
                                    },
                                    {
                                       type: "String",
                                       name: "param2",
                                    },
                                 ],
                                 static: true,
                              },
                              {
                                 type: "void",
                                 name: "main",
                                 accessModifier: "public",
                                 parameters: [
                                    {
                                       type: "String[]",
                                       name: "args",
                                    },
                                 ],
                                 static: true,
                              },
                           ],
                        });
                     }}
                  >
                     <span
                        role="button"
                        className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                     >
                        <svg className="svg" width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
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
               {nodes.map((node) => {
                  const props = node.getProp();
                  const nodeId = props.id;
                  const nodeName = props.name;
                  const isSelected = selectedCells.includes(node);

                  return (
                     <div
                        key={nodeId}
                        className={`flex items-center hover:bg-slate-200 rounded cursor-pointer gap-3 py-1 pl-4 mb-0.5 ${
                           isSelected && "bg-slate-300 font-semibold"
                        }`}
                        onClick={() => {
                           graph.current.centerCell(node);
                           graph.current.cleanSelection(node);
                           graph.current.select(node);
                        }}
                     >
                        <div className="w-3">
                           {/* {isSelected && (
                              <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                                    fillRule="evenodd"
                                    fillOpacity="1"
                                    stroke="none"
                                 />
                              </svg>
                           )} */}
                        </div>
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: "180px" }}>
                           {nodeName}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {edges.length > 0 && (
            <>
               <hr className="border-slate-400" />

               {/* ---------------------- EDGES SECTION ---------------------- */}
               <div className="pb-1">
                  <div className="flex flex-col">
                     <div className="flex justify-between mt-2">
                        <div className="font-bold mb-1">Edges</div>
                     </div>

                     {edges.map((node) => {
                        const props = node.getProp();
                        const edgeId = props.id;
                        const isSelected = selectedCells.includes(node);

                        const sourceNodeName = graph.current.getCellById(props.source.cell)?.prop("name");
                        const targetNodeName = graph.current.getCellById(props.target.cell)?.prop("name");

                        return (
                           <div
                              key={edgeId}
                              className={`flex items-center hover:bg-slate-200 rounded cursor-pointer gap-3 py-1 pl-4 mb-0.5 ${
                                 isSelected && "bg-slate-300 font-semibold"
                              }`}
                              onClick={() => {
                                 graph.current.centerCell(node);
                                 graph.current.cleanSelection(node);
                                 graph.current.select(node);
                              }}
                           >
                              <div className="w-3">
                                 {/* {isSelected && (
                                    <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                                       <path
                                          d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                                          fillRule="evenodd"
                                          fillOpacity="1"
                                          stroke="none"
                                       />
                                    </svg>
                                 )} */}
                              </div>
                              <div className="flex">
                                 <div className="text-ellipsis overflow-hidden whitespace-nowrap" style={{ width: "78px" }}>
                                    {sourceNodeName}
                                 </div>
                                 <div className="w-6 text-center">{" -> "}</div>
                                 <div className="text-ellipsis overflow-hidden whitespace-nowrap" style={{ width: "78px" }}>
                                    {targetNodeName}
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </>
         )}
      </div>
   );
}
