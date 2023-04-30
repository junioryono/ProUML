import type X6Type from "@antv/x6";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Diagram, Issue } from "types";
import { OpenArrow, OpenDiamond, SolidArrow, SolidDiamond } from "../right-panel/edges/edge-endings";
import { toast } from "@/ui/toast";
import { createDiagram } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

const edgeEndings = [
   {
      name: "open arrow",
      icon: <OpenArrow direction="right" />,
   },
   {
      name: "open diamond",
      icon: <OpenDiamond direction="right" />,
   },
   {
      name: "solid arrow",
      icon: <SolidArrow direction="right" />,
   },
   {
      name: "solid diamond",
      icon: <SolidDiamond direction="right" />,
   },
];

export default function LeftPanel({
   diagram,
   graph,
   selectedIssue,
   setSelectedIssue,
}: {
   diagram: Diagram;
   graph: MutableRefObject<X6Type.Graph>;
   selectedIssue: Issue;
   setSelectedIssue: Dispatch<SetStateAction<Issue>>;
}) {
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

      graph.current?.on("cell:selected", (args) => {
         setSelectedCells(graph.current?.getSelectedCells());

         if (!args?.options?.issue) {
            setSelectedIssue(undefined);
         }
      });

      graph.current?.on("cell:unselected", (args) => {
         setSelectedCells(graph.current?.getSelectedCells());

         if (!args?.options?.issue) {
            setSelectedIssue(undefined);
         }
      });

      // Need to change node names in the left panel when the node name is changed in the graph
      graph.current?.on("node:change:name", () => {
         setNodes(graph.current?.getNodes() || []);
      });
   }, [graph]);

   useEffect(() => {}, [selectedCells]);

   useEffect(() => {
      console.log("selectedIssue", selectedIssue);
   }, [selectedIssue]);

   return (
      <div className="w-60 h-[calc(100vh-3rem)] overflow-y-auto no-scrollbar overflow-x-hidden p-2 flex flex-col border-gray-400 border-r-1 select-none cursor-default">
         {/* ---------------------- DIAGRAMS SECTION ---------------------- */}
         {diagram.project && (
            <>
               <div className="pb-1">
                  <div className="flex justify-between">
                     <div className="font-bold pb-1">Diagrams</div>
                     <div className="mb-1 duration-500 hover:scale-[1.2] flex justify-center items-center">
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
                              "rounded flex items-center gap-3 py-1 pl-3 mb-0.5",
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
               <hr className="border-slate-400 mb-2" />
            </>
         )}

         {/* ---------------------- NODES SECTION ---------------------- */}
         <div className="pb-1">
            <div className="flex flex-col">
               <div className="flex justify-between">
                  <div className="font-bold mb-1">Nodes</div>

                  <div
                     className="mb-1 duration-500 hover:scale-[1.2] flex justify-center items-center"
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
                  const isLocked = props.lock;

                  return (
                     <div
                        key={nodeId}
                        className={cn(
                           "flex items-center rounded cursor-pointer gap-3 py-1 pl-3 mb-0.5",
                           isSelected && "bg-slate-300 font-semibold",
                           !isSelected && "hover:bg-slate-200",
                        )}
                        onClick={() => {
                           graph.current.centerCell(node);
                           graph.current.cleanSelection(node);
                           graph.current.select(node, { ui: true });
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
                           {/* if the node is locked */}
                           {isLocked ? (
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                 <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                 <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path
                                       fill-rule="evenodd"
                                       clip-rule="evenodd"
                                       d="M5.5 10V7C5.5 5.27609 6.18482 3.62279 7.40381 2.40381C8.62279 1.18482 10.2761 0.5 12 0.5C13.7239 0.5 15.3772 1.18482 16.5962 2.40381C17.8152 3.62279 18.5 5.27609 18.5 7V10H19C20.6569 10 22 11.3431 22 13V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V13C2 11.3431 3.34315 10 5 10H5.5ZM9.52513 4.52513C10.1815 3.86875 11.0717 3.5 12 3.5C12.9283 3.5 13.8185 3.86875 14.4749 4.52513C15.1313 5.1815 15.5 6.07174 15.5 7V10H8.5V7C8.5 6.07174 8.86875 5.1815 9.52513 4.52513Z"
                                       fill="#000000"
                                    ></path>
                                 </g>
                              </svg>
                           ) : (
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                                 <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                 <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path
                                       d="M9.52513 4.52513C10.1815 3.86875 11.0717 3.5 12 3.5C12.9283 3.5 13.8185 3.86875 14.4749 4.52513C14.7873 4.83751 15.0344 5.20276 15.2078 5.59999L15.4078 6.05825C15.6287 6.56443 16.2181 6.79568 16.7243 6.57477L17.6408 6.17478C18.147 5.95387 18.3783 5.36445 18.1574 4.85827L17.9574 4.40001C17.6355 3.66243 17.1763 2.98389 16.5962 2.40381C15.3772 1.18482 13.7239 0.5 12 0.5C10.2761 0.5 8.62279 1.18482 7.40381 2.40381C6.18482 3.62279 5.5 5.27609 5.5 7V10H5C3.34315 10 2 11.3431 2 13V20C2 21.6569 3.34315 23 5 23H19C20.6569 23 22 21.6569 22 20V13C22 11.3431 20.6569 10 19 10H8.5V7C8.5 6.07174 8.86875 5.1815 9.52513 4.52513Z"
                                       fill="#000000"
                                    ></path>
                                 </g>
                              </svg>
                           )}
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

                        const edge = graph.current.getCellById(edgeId);
                        const sourceNodeName = graph.current.getCellById(props.source.cell)?.prop("name");
                        const targetNodeName = graph.current.getCellById(props.target.cell)?.prop("name");

                        return (
                           <div
                              key={edgeId}
                              className={cn(
                                 "flex items-center rounded cursor-pointer gap-3 py-1 pl-3 mb-0.5",
                                 isSelected && "bg-slate-300 font-semibold",
                                 !isSelected && "hover:bg-slate-200",
                              )}
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
                                 <div className="w-6 text-center">
                                    {/* get the type of relationship of the edge */}
                                    {"-->"}
                                 </div>
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

         {diagram.issues?.length > 0 && (
            <>
               <hr className="border-slate-400 my-2" />

               {/* ---------------------- ISSUES SECTION ---------------------- */}
               <div className="pb-1">
                  <div className="flex justify-between">
                     <div className="font-bold pb-1">Issues</div>
                  </div>

                  {diagram.issues.map((issue) => {
                     const isSelected = selectedIssue?.id === issue.id;
                     console.log("issue", issue);

                     return (
                        <div
                           key={issue.id}
                           className={cn(
                              "flex items-center rounded cursor-pointer gap-3 py-1 pl-3 mb-0.5",
                              isSelected && "bg-slate-300 font-semibold",
                              !isSelected && "hover:bg-slate-200",
                           )}
                           onClick={() => {
                              console.log("issue", issue);
                              graph.current.cleanSelection({ issue: true });
                              graph.current.select(issue.connected_cells, { issue: true });

                              const cells = graph.current
                                 .getCells()
                                 .filter((cell) => issue.connected_cells.includes(cell.id));
                              const bbox = graph.current.getCellsBBox(cells);
                              const center = bbox.center;
                              graph.current.centerPoint(center.x, center.y);

                              setSelectedIssue(issue);
                           }}
                        >
                           <div className="w-3"></div>
                           <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: "180px" }}>
                              {issue.title}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </>
         )}
      </div>
   );
}
