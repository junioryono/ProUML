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
import { cn } from "@/lib/utils";

// bg color options for styling bar
const backgroundColorOptions = [
   "FFFFFF", // white
   "DFFF00", // yellow
   "FFBF00", // orange
   "FF7F50", // red orange
   "DE3163", // red
   "9FE2BF", // green
   "40E0D0", // teal
   "6495ED", // blue
   "AF7AC5", // purple
   "CCCCFF", // pink
];

// border color options for styling bar
const borderColorOptions = [
   "000000", // black
   "BBBBBB", // grey
   "0B5394", // blue
   "CC0000", // red
   "6A329F", // purple
];

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

   // for colors of selected uml box
   const [selectedBoxBackgroundColor, setSelectedBoxBackgroundColor] = useState("FFFFFF"); // <- default should be initial bg color
   const [selectedBoxBorderColor, setSelectedBoxBorderColor] = useState("000000"); // <- default should be initial border color

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
                     <div className="flex items-center cursor-pointer content-center gap-1">
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
                        <div className="font-bold">Pages</div>
                        <div className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center">
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
                                 ></path>
                              </svg>
                           </span>
                        </div>
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
                        <div className="flex flex-col">
                           <div>Diagram Name</div>
                           <div>Diagram Name</div>
                           <div>Diagram Name</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div className="font-bold"> Nodes</div>
                        <div className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center">
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
                                 ></path>
                              </svg>
                           </span>
                        </div>
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
                        <div>Node 1</div>
                     </div>
                  </div>

                  <div className="flex flex-col">
                     <div className="flex justify-between">
                        <div className="font-bold">Edges</div>
                        <div className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center">
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
                                 ></path>
                              </svg>
                           </span>
                        </div>
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
                        <div>Edge 1</div>
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
                  {/* uml box background color section */}
                  <div className="flex flex-col pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold">Background</div>
                     </div>

                     {/* all of the background color options */}
                     <div className="flex items-center gap-2">
                        <div>
                           {backgroundColorOptions.map((color) => {
                              console.log(color);

                              return color === selectedBoxBackgroundColor ? (
                                 // if the current bg color is set to this color, put a checkmark svg on it
                                 <button
                                    style={{ color: `#${color}` }}
                                    className={`m-1 border-2 transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-[#${color}]`}
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 25">
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 </button>
                              ) : (
                                 // if the current bg color is not set to this color
                                 <button
                                    className={`m-1 border-2 transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-[#${color}]`}
                                    onClick={() => {
                                       setSelectedBoxBackgroundColor(color);
                                    }}
                                 />
                              );
                           })}
                        </div>
                     </div>

                     {/* the current color hex code of the box */}
                     <div className="mt-2  w-full flex">
                        <div
                           style={{ color: `#${selectedBoxBackgroundColor}` }}
                           className={`ml-9 mr-1 border border-black rounded-md h-6 w-6`}
                        />

                        <input
                           placeholder={`#${selectedBoxBackgroundColor} `}
                           className="w-1/2 my-0 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                           type="text"
                           autoCapitalize="none"
                           autoComplete="both"
                           autoCorrect="off"
                           spellCheck="false"
                           disabled
                        />
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* uml box border color section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold">Border</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div>
                           {/* all of the color options */}
                           {borderColorOptions.map((color) => {
                              console.log(color);

                              // if the current collor
                              return color === selectedBoxBorderColor ? (
                                 <button
                                    className={`m-1 border-2 transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-[#${color}]`}
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="16"
                                       height="16"
                                       viewBox="0 0 25 25"
                                       fill="white"
                                    >
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 </button>
                              ) : (
                                 <button
                                    className={`m-1 border-2 transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-[#${color}]`}
                                    onClick={() => {
                                       setSelectedBoxBorderColor(color);
                                    }}
                                 />
                              );
                           })}
                        </div>
                     </div>

                     {/* the current color hex code of the box */}
                     <div className="mt-2  w-full flex">
                        <div
                           style={{ color: `#${selectedBoxBorderColor}` }}
                           className={`ml-9 mr-1 border border-black rounded-md h-6 w-6`}
                        />

                        <input
                           placeholder={`#${selectedBoxBorderColor} `}
                           className="w-1/2 my-0 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                           type="text"
                           autoCapitalize="none"
                           autoComplete="both"
                           autoCorrect="off"
                           spellCheck="false"
                           disabled
                        />
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* uml box font style section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold">Text Styles</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <div>{/* all of the color options */}</div>
                     </div>
                  </div>

                  <hr className="border-slate-400" />
               </div>
            )}
         </div>
      </div>
   );
}
