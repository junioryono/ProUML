import type X6Type from "@antv/x6";

import { MutableRefObject, createRef, useEffect, useState } from "react";
import { DropdownMenu, SubDropdownMenu } from "@/ui/dropdown";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DownloadJavaSkeleton from "./skeleton/java";

export default function Menu({
   graph,
   ready,
   diagramName,
}: {
   graph: MutableRefObject<X6Type.Graph>;
   ready: boolean;
   diagramName: string;
}) {
   const [openArrow, setOpenArrow] = useState(false);

   const [open, setOpen] = useState(false);
   const [hovered, setHovered] = useState(false);
   const [canUndo, setCanUndo] = useState(false);
   const [canRedo, setCanRedo] = useState(false);
   const [cellsAreSelected, setCellsAreSelected] = useState(false);

   useEffect(() => {
      if (open || hovered) {
         setOpenArrow(true);
      } else {
         setOpenArrow(false);
      }
   }, [open, hovered]);

   useEffect(() => {
      if (!ready || !graph.current) {
         return;
      }

      graph.current.on("history:change", () => {
         setCanUndo(graph.current.canUndo());
         setCanRedo(graph.current.canRedo());
      });

      graph.current.on("selection:changed", () => {
         setCellsAreSelected(graph.current.getSelectedCells().length > 0);
      });

      return () => {
         graph.current?.off("history:added");
         graph.current?.off("selection:changed");
      };
   }, [ready, graph]);

   const [fileInputRef] = useState(createRef<HTMLInputElement>());

   const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!graph.current) {
         return;
      }

      const file = e.target.files[0];
      if (!file || !file.name.endsWith(".json")) {
         return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
         try {
            if (!event.target?.result) {
               return;
            }

            const parsedJSON = JSON.parse(event.target.result as string);

            if (!parsedJSON || !Array.isArray(parsedJSON.cells)) {
               throw new Error("Invalid JSON file");
            }

            const cells = graph.current.parseJSON(parsedJSON);

            for (const cell of cells) {
               cell.addTo(graph.current);
            }
         } catch (err) {
            console.error("Error parsing JSON file:", err);
         }
      };
      reader.readAsText(file);
   };

   return (
      <DropdownMenu onOpenChange={setOpen}>
         <DropdownMenu.Trigger
            className="cursor-default w-[52px] h-full px-2 text-xs flex justify-center items-center gap-1 hover:bg-diagram-menu-item-hovered focus-visible:outline-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onContextMenu={(e) => e.preventDefault()}
         >
            <Icons.logo
               style={{
                  strokeWidth: 1.3,
                  width: 20,
               }}
            />
            <svg
               className={cn("transition-all duration-100", openArrow ? "mt-[6px]" : "mt-0")}
               width="8"
               height="7"
               viewBox="0 0 8 7"
               xmlns="http://www.w3.org/2000/svg"
            >
               <path
                  className="fill-white"
                  d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
                  fillRule="evenodd"
                  fillOpacity="1"
                  fill="#000"
                  stroke="none"
               />
            </svg>
         </DropdownMenu.Trigger>
         <DropdownMenu.Portal>
            <DropdownMenu.Content className="mt-1 ml-2 py-1 md:w-48 rounded-none bg-diagram-menu border-0" align="end">
               <Link href="/dashboard/diagrams">
                  <DropdownMenu.Item className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected hover:bg-diagram-menu-item-hovered focus:text-white">
                     Back to dashboard
                  </DropdownMenu.Item>
               </Link>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <input
                  type="file"
                  accept=".json"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileInputChange(e)}
               />

               <DropdownMenu.Item
                  className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                  onSelect={() => fileInputRef.current.click()}
               >
                  Import JSON
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className="text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                  onSelect={() => {
                     const cells = graph.current?.toJSON();
                     if (!cells) {
                        return;
                     }

                     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cells));
                     const downloadAnchorNode = document.createElement("a");
                     downloadAnchorNode.setAttribute("href", dataStr);
                     downloadAnchorNode.setAttribute("download", `${diagramName}.json`);
                     document.body.appendChild(downloadAnchorNode);
                     downloadAnchorNode.click();
                     downloadAnchorNode.remove();
                  }}
               >
                  Download JSON
               </DropdownMenu.Item>

               <SubDropdownMenu>
                  <SubDropdownMenu.Trigger>
                     <div className="pr-2">Download Skeleton</div>
                     <SubDropdownMenu.Arrow />
                  </SubDropdownMenu.Trigger>

                  <SubDropdownMenu.Content>
                     <DropdownMenu.Item
                        className="text-white text-xs px-7 h-6 opacity-50"
                        onSelect={(e) => {
                           e.preventDefault();
                        }}
                     >
                        C++
                     </DropdownMenu.Item>

                     <DropdownMenu.Item
                        className="text-white text-xs px-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white"
                        onSelect={(e) => {
                           if (!graph.current) {
                              e.preventDefault();
                              return;
                           }

                           DownloadJavaSkeleton(diagramName, graph.current.getCells());
                        }}
                     >
                        Java
                     </DropdownMenu.Item>
                  </SubDropdownMenu.Content>
               </SubDropdownMenu>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !canUndo && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!canUndo) {
                        e.preventDefault();
                        return;
                     }

                     graph.current?.undo();
                  }}
               >
                  Undo
               </DropdownMenu.Item>
               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !canRedo && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!canRedo) {
                        e.preventDefault();
                        return;
                     }

                     graph.current?.redo();
                  }}
               >
                  Redo
               </DropdownMenu.Item>
               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells) {
                        return;
                     }

                     // Start batch
                     graph.current?.startBatch("Duplicate");

                     let clonedCells: X6Type.Cell<X6Type.Cell.Properties>[] = [];
                     for (const cell of cells) {
                        const clone = cell.clone();
                        clone.translate(20, 20);
                        graph.current?.addCell(clone);
                        clonedCells.push(clone);
                     }

                     // Select cloned cells
                     graph.current?.resetSelection(clonedCells);

                     // End batch
                     graph.current?.stopBatch("Duplicate");
                  }}
               >
                  Duplicate
               </DropdownMenu.Item>
               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells || cells.length === 0) {
                        return;
                     }

                     graph.current.removeCells(cells);
                  }}
               >
                  Delete
               </DropdownMenu.Item>

               <DropdownMenu.Separator className="my-1 bg-[#636363]" />

               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells || cells.length === 0) {
                        return;
                     }

                     for (const cell of cells) {
                        cell.toFront();
                     }
                  }}
               >
                  Bring to front
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells || cells.length === 0) {
                        return;
                     }

                     for (const cell of cells) {
                        const zIndex = cell.getZIndex();
                        if (zIndex === 0) {
                           return;
                        }

                        cell.setZIndex(zIndex + 1);
                     }
                  }}
               >
                  Bring forward
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells || cells.length === 0) {
                        return;
                     }

                     for (const cell of cells) {
                        const zIndex = cell.getZIndex();
                        if (zIndex === 0) {
                           return;
                        }

                        cell.setZIndex(zIndex - 1);
                     }
                  }}
               >
                  Send backward
               </DropdownMenu.Item>

               <DropdownMenu.Item
                  className={cn(
                     "text-white text-xs pl-7 h-6 focus:bg-diagram-menu-item-selected focus:text-white",
                     !cellsAreSelected && "opacity-50",
                  )}
                  onSelect={(e) => {
                     if (!cellsAreSelected) {
                        e.preventDefault();
                        return;
                     }

                     const cells = graph.current?.getSelectedCells();
                     if (!cells || cells.length === 0) {
                        return;
                     }

                     for (const cell of cells) {
                        cell.toBack();
                     }
                  }}
               >
                  Send to back
               </DropdownMenu.Item>
            </DropdownMenu.Content>
         </DropdownMenu.Portal>
      </DropdownMenu>
   );
}
