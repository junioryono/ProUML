import type X6Type from "@antv/x6";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Diagram, Issue } from "types";
import { OpenArrow, OpenDiamond, SolidArrow, SolidDiamond } from "../right-panel/edges/edge-endings";
import { toast } from "@/ui/toast";
import { createDiagram } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
                              "flex items-center py-1 mb-0.5 gap-1",
                              pDiagram.id === diagram.id && "bg-slate-300 font-semibold",
                              pDiagram.id !== diagram.id && "hover:bg-slate-200 cursor-pointer",
                           )}
                           onClick={() => {
                              if (pDiagram.id !== diagram.id) {
                                 router.push(`/dashboard/diagrams/${pDiagram.id}`);
                              }
                           }}
                        >
                           <div className="flex items-center">
                              <div className="ml-1">
                                 <svg
                                    fill="#000000"
                                    height="20"
                                    width="20"
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                 >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                       <g>
                                          <g>
                                             <path d="M496,324.362h-31.702v-60.01c0-8.836-7.164-16-16-16H271.996v-60.714h127.109c8.836,0,16-7.164,16-16V76.235 c0-8.836-7.164-16-16-16h-286.21c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h127.101v60.714H63.702 c-8.836,0-16,7.164-16,16v60.01H16c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h95.404c8.836,0,16-7.164,16-16v-95.404 c0-8.836-7.164-16-16-16H79.702v-44.01h160.293v44.01h-31.698c-8.836,0-16,7.164-16,16v95.404c0,8.836,7.164,16,16,16h95.404 c8.836,0,16-7.164,16-16v-95.404c0-8.836-7.164-16-16-16h-31.707v-44.01h160.302v44.01h-31.702c-8.836,0-16,7.164-16,16v95.404 c0,8.836,7.164,16,16,16H496c8.836,0,16-7.164,16-16v-95.404C512,331.525,504.836,324.362,496,324.362z M95.404,356.362v63.404H32 v-63.404H95.404z M287.702,356.362v63.404h-63.404v-63.404H287.702z M128.895,155.638V92.235h254.21v63.404H128.895z M480,419.765 h-63.404v-63.404H480V419.765z"></path>{" "}
                                          </g>
                                       </g>
                                    </g>
                                 </svg>
                              </div>
                           </div>
                           <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: "190px" }}>
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

               {/* if no nodes exist yet, show a msg */}
               {nodes.length === 0 && (
                  <div className="text-md font-bold text-center bg-slate-300 rounded-2xl p-3">
                     <div className="flex flex-col justify-center items-center">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={35} height={35}>
                           <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                           <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <path
                                 d="M16 10H16.01M12 10H12.01M8 10H8.01M7 16V21L12 16H20V4H4V16H7Z"
                                 stroke="#000000"
                                 strokeWidth="1.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              ></path>
                           </g>
                        </svg>
                        There are no nodes in this diagram! Click the "+" button to add a node, or drag a template onto the
                        diagram.
                     </div>
                  </div>
               )}

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
                           "flex items-center cursor-pointer py-1",
                           isSelected && "bg-slate-300 font-semibold",
                           !isSelected && "hover:bg-slate-200",
                        )}
                        onClick={() => {
                           graph.current.centerCell(node);
                           graph.current.cleanSelection(node);
                           graph.current.select(node, { ui: true });
                        }}
                     >
                        <div className="flex justify-between w-full">
                           <div className="flex gap-1 items-center">
                              <div className="ml-1">
                                 <svg
                                    viewBox="0 0 64 64"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="#000000"
                                    transform="rotate(90)"
                                    strokeWidth="6.4"
                                    width={16}
                                    height={16}
                                 >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                       <rect x="8" y="8" width="48" height="48"></rect>
                                       <line x1="32" y1="56" x2="32" y2="8"></line>
                                    </g>
                                 </svg>
                              </div>
                              <div className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ width: "177px" }}>
                                 {nodeName}
                              </div>
                           </div>
                           {/* only show the lock svg if the div of this node is being hovered over */}
                           <div className="ml-auto pr-1">
                              {/* if the node is locked */}
                              {isLocked ? (
                                 <svg
                                    fill="#000000"
                                    viewBox="10 0 56 56"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                 >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                       <path d="M 28.0000 4.2578 C 21.4609 4.2578 15.4844 8.9219 15.4844 18.5078 L 15.4844 24.1328 C 12.9531 24.4375 11.7109 25.9610 11.7109 28.9610 L 11.7109 46.8438 C 11.7109 50.2188 13.2578 51.7422 16.375 51.7422 L 39.625 51.7422 C 42.7422 51.7422 44.2891 50.2188 44.2891 46.8438 L 44.2891 28.9375 C 44.2891 25.9375 43.0469 24.3437 40.5156 24.0625 L 40.5156 18.5078 C 40.5156 8.9219 34.5391 4.2578 28.0000 4.2578 Z M 19.2578 17.9922 C 19.2578 11.4532 23.1484 7.8672 28.0000 7.8672 C 32.8515 7.8672 36.7422 11.4532 36.7422 17.9922 L 36.7422 24.0391 L 19.2578 24.0625 Z"></path>
                                    </g>
                                 </svg>
                              ) : (
                                 <svg
                                    fill="#000000"
                                    viewBox="0 0 56 56"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={16}
                                    height={16}
                                 >
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                       <path d="M 40.3163 3.2969 C 33.7070 3.2969 27.3320 7.8438 27.3320 17.5234 L 27.3320 24.9063 L 7.2460 24.9063 C 4.1288 24.9063 2.6757 26.3828 2.6757 29.7344 L 2.6757 47.8750 C 2.6757 51.2266 4.1288 52.7031 7.2460 52.7031 L 30.8242 52.7031 C 33.9413 52.7031 35.3944 51.2266 35.3944 47.8750 L 35.3944 29.7344 C 35.3944 26.5000 34.0351 25.0234 31.1054 24.9297 L 31.1054 17.0313 C 31.1054 10.3750 35.4179 6.8828 40.3163 6.8828 C 45.2382 6.8828 49.5505 10.3750 49.5505 17.0313 L 49.5505 22.4219 C 49.5505 24.0860 50.3708 24.7891 51.4489 24.7891 C 52.4804 24.7891 53.3243 24.1563 53.3243 22.4922 L 53.3243 17.5234 C 53.3243 7.8438 46.9259 3.2969 40.3163 3.2969 Z"></path>
                                    </g>
                                 </svg>
                              )}
                           </div>
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
                                 "flex items-center cursor-pointer gap-3 py-1",
                                 isSelected && "bg-slate-300 font-semibold",
                                 !isSelected && "hover:bg-slate-200",
                              )}
                              onClick={() => {
                                 graph.current.centerCell(node);
                                 graph.current.cleanSelection(node);
                                 graph.current.select(node);
                              }}
                           >
                              <div className="flex">
                                 <div className="flex gap-0.5 items-center">
                                    <div className="ml-1">
                                       <svg
                                          fill="#000000"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                          stroke="#000000"
                                          strokeWidth="1.2"
                                          width={16}
                                          height={16}
                                       >
                                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                             <path d="M3.293,20.707a1,1,0,0,1,0-1.414l16-16a1,1,0,1,1,1.414,1.414l-16,16A1,1,0,0,1,3.293,20.707Z"></path>
                                          </g>
                                       </svg>
                                    </div>
                                    <div
                                       className="text-ellipsis overflow-hidden whitespace-nowrap flex-shrink-0"
                                       style={{ maxWidth: "78px" }}
                                    >
                                       {sourceNodeName}
                                    </div>
                                 </div>
                                 <div className="w-6 text-center">
                                    {/* get the type of relationship of the edge */}
                                    {"-->"}
                                 </div>
                                 <div className="flex flex-grow-1">
                                    <div
                                       className="text-ellipsis overflow-hidden whitespace-nowrap flex-shrink-0"
                                       style={{ maxWidth: "78px" }}
                                    >
                                       {targetNodeName}
                                    </div>
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
               <hr className="border-slate-400 mb-2" />

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
                              "flex items-center cursor-pointer h-[29px]",
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
                           <div className="flex gap-1 items-center">
                              <div>
                                 <Image
                                    src={issue.created_by.picture}
                                    width={27}
                                    height={27}
                                    className="rounded-full border-2 border-double -ml-4 only:ml-0"
                                    alt="avatar"
                                 />
                              </div>
                              <div className="text-ellipsis overflow-hidden whitespace-nowrap" style={{ width: "185px" }}>
                                 {issue.title}
                              </div>
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
