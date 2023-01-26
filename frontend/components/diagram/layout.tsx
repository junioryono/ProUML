"use client";

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { UserAccountNav } from "@/components/dashboard/user-account-nav";
import { ReadyState } from "react-use-websocket";
import { Diagram } from "types";

import { useX6 } from "@/components/diagram/x6";
import { Menu } from "@/components/diagram/header/menu";
import { ZoomButton } from "@/components/diagram/header/zoom-button";
import { ShareButton } from "@/components/diagram/header/share-button";
import { Selector } from "@/components/diagram/header/selector";
import { Components } from "@/components/diagram/header/components";
import { HandTool } from "@/components/diagram/header/hand-tool";
import { AddComment } from "@/components/diagram/header/add-comment";

export type LayoutProps = {
   setZoom: Dispatch<SetStateAction<number>>;
};

export function DiagramLayout({ diagram }: { diagram: Diagram }) {
   // States
   const [zoom, setZoom] = useState(1);
   const [panning, setPanning] = useState(false);

   // Core
   const container = useRef<HTMLDivElement>();
   const { graph, sessionId, ready } = useX6(container, diagram, {
      setZoom,
   });

   const refContainer = useCallback((containerParam: HTMLDivElement) => {
      container.current = containerParam;
   }, []);

   useEffect(() => {
      console.log("diagram", diagram);
   }, [diagram]);

   return (
      <div className="flex flex-col">
         <div className="flex justify-between items-center h-12 bg-diagram-menu text-white">
            <div className="flex h-full items-center">
               <Menu graph={graph} />
               <Selector graph={graph} panning={panning} setPanning={setPanning} />
               <HandTool graph={graph} panning={panning} setPanning={setPanning} />
               <Components graph={graph} />
               <AddComment graph={graph} />
            </div>
            <div className="basis-2/4 flex justify-center items-center gap-2">
               <h1 className="text-md">
                  {diagram.project && (
                     <>
                        <div>{diagram.project.name}</div>
                        <div>/</div>
                     </>
                  )}
                  <div>{diagram.name}</div>
               </h1>
               <svg className="svg" width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
                     fillRule="evenodd"
                     fillOpacity="1"
                     fill="#000"
                     stroke="none"
                     className="fill-white"
                  />
               </svg>
            </div>
            <div className="flex h-full items-center">
               <UserAccountNav />
               <ShareButton diagram={diagram} />
               <ZoomButton graph={graph} zoom={zoom} />
            </div>
         </div>
         <div className="flex text-sm">
            {!ready && (
               <div className="flex justify-center items-center w-full h-full">
                  <div className="flex flex-col items-center gap-2">
                     <div className="text-gray-500">Loading...</div>
                  </div>
               </div>
            )}

            {/* Left bar */}
            {ready && (
               <div className="w-60 p-2 flex flex-col border-gray-400 border-r-1">
                  <div className="flex flex-col">
                     <div className="flex items-center content-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M9.04 9.81c-.739.576-1.668.917-2.676.917C3.953 10.727 2 8.775 2 6.364 2 3.953 3.953 2 6.364 2c2.41 0 4.363 1.953 4.363 4.364 0 1.008-.342 1.937-.916 2.676l3.484 3.483-.772.771L9.04 9.811zm.596-3.446c0 1.807-1.465 3.272-3.272 3.272-1.808 0-3.273-1.465-3.273-3.272 0-1.808 1.465-3.273 3.273-3.273 1.807 0 3.272 1.465 3.272 3.273z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              fill="#000"
                              stroke="none"
                           ></path>
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
                           />
                        </div>
                     </div>
                     <div className="flex justify-between">
                        <div>Pages</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div>Nodes</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div>Edges</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>
               </div>
            )}

            <div className="flex-1">
               <div ref={refContainer} />
            </div>

            {/* Right bar */}
            {ready && (
               <div className="w-60 p-2 flex flex-col border-gray-400 border-l-1">
                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div>Edges</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div>Edges</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div>Edges</div>
                        <div>+</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <svg width="8" height="8" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
                           <path
                              d="M1.176 2.824L3.06 4.706 6.824.941 8 2.118 3.059 7.059 0 4l1.176-1.176z"
                              fillRule="evenodd"
                              fillOpacity="1"
                              stroke="none"
                           ></path>
                        </svg>
                        <div>Page 1</div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
