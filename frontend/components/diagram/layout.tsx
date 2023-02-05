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

// bg color options for styling bar (lighter colors)
const backgroundColorOptions = [
   "FFFFFF", // white
   "F8B4D9", // pink-300
   "F8B4B4", // red-300
   "FDBA8C", // orange-300
   "FACA15", // yellow-300
   "84E1BC", // green-300
   "7EDCE2", // teal-300
   "A4CAFE", // blue-300
   "B4C6FC", // indigo-300
   "CABFFD", // purple-300
];

// border color options for styling bar (darker colors)
const borderColorOptions = [
   "000000", // black
   "046C4E", // green
   "0B5394", // blue
   "6A329F", // purple
   "800000", // maroon
   "5A5A5A", // grey
   "964B00", // brown
   "CC0000", // red
   "DB4914", // orange
   "B58B00", // yellow
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

   // ---------------------- VARIABLES FOR THE RIGHT SIDEBAR -------------------------

   // for colors of selected uml box
   const [selectedCellBackgroundColor, setSelectedCellBackgroundColor] = useState("FFFFFF"); // <- default should be initial bg color
   const [selectedCellBorderColor, setSelectedCellBorderColor] = useState("000000"); // <- default should be initial border color

   // for if selected uml box position or size is locked
   const [selectedCellPositionLocked, setSelectedCellPositionLocked] = useState(false);
   const [selectedCellSizeLocked, setSelectedCellSizeLocked] = useState(false);

   // --------------------------------------------------------------------------------

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
                        <div className="font-bold">Background Color</div>
                     </div>

                     {/* all of the background color options */}
                     <div className="flex items-center gap-2">
                        <div>
                           {backgroundColorOptions.map((color) => {
                              return color === selectedCellBackgroundColor ? (
                                 // if the current bg color is set to this color, put a checkmark svg on it
                                 <button
                                    style={{ color: `#${color}` }}
                                    className={
                                       "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                                    }
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25">
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 </button>
                              ) : (
                                 // if the current bg color is not set to this color
                                 <button
                                    style={{ color: `#${color}` }}
                                    className={
                                       "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                                    }
                                    onClick={() => {
                                       setSelectedCellBackgroundColor(color);
                                    }}
                                 />
                              );
                           })}
                        </div>
                     </div>

                     {/* the current color hex code of the box */}
                     <div className="mt-2  w-full flex">
                        <div
                           style={{ color: `#${selectedCellBackgroundColor}` }}
                           className={`ml-9 mr-1 border border-black rounded-md h-6 w-6 bg-current`}
                        />
                        <input
                           value={`#${selectedCellBackgroundColor} `}
                           className="w-1/2 my-0 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md text-center focus:outline-none"
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
                        <div className="font-bold">Border Color</div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div>
                           {/* all of the color options */}
                           {borderColorOptions.map((color) => {
                              // if the current collor
                              return color === selectedCellBorderColor ? (
                                 <button
                                    style={{ color: `#${color}` }}
                                    className={
                                       "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                                    }
                                 >
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       width="18"
                                       height="18"
                                       viewBox="0 0 25 25"
                                       fill="white"
                                    >
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 </button>
                              ) : (
                                 <button
                                    style={{ color: `#${color}` }}
                                    className={
                                       "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                                    }
                                    onClick={() => {
                                       setSelectedCellBorderColor(color);
                                    }}
                                 />
                              );
                           })}
                        </div>
                     </div>

                     {/* the current color hex code of the cell */}
                     <div className="mt-2  w-full flex">
                        <div
                           style={{ color: `#${selectedCellBorderColor}` }}
                           className={"ml-9 mr-1 border border-black rounded-md h-6 w-6 bg-current"}
                        />
                        <input
                           value={`#${selectedCellBorderColor} `}
                           className="w-1/2 my-0 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md text-center focus:outline-none"
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

                  {/* cell border width section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold mb-2">Border Width</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <div>
                           {/* 0% thickness */}
                           <button className="border border-slate-400 rounded-md bg-slate-200 transition duration-500 hover:scale-125">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000"
                                 width="40"
                                 height="30"
                                 viewBox="0 0 24 24"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke="#CCCCCC"
                                    stroke-width="0.096"
                                 ></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path d="M23 13H2v-2h21v2z"></path>
                                 </g>
                              </svg>
                           </button>

                           {/* 33% thickness */}
                           <button className="border border-slate-400 rounded-md bg-slate-200 ml-3 mr-3 transition duration-500 hover:scale-125">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000"
                                 viewBox="0 0 24 24"
                                 stroke="#000000"
                                 stroke-width="0.792"
                                 width="40"
                                 height="30"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke="#CCCCCC"
                                    stroke-width="0.096"
                                 ></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path d="M23 13H2v-2h21v2z"></path>
                                 </g>
                              </svg>
                           </button>

                           {/* 66% thickness */}
                           <button className="border border-slate-400 rounded-md bg-slate-200 mr-3 transition duration-500 hover:scale-125">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000"
                                 viewBox="0 0 24 24"
                                 stroke="#000000"
                                 stroke-width="1.608"
                                 width="40"
                                 height="30"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke="#CCCCCC"
                                    stroke-width="0.096"
                                 ></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path d="M23 13H2v-2h21v2z"></path>
                                 </g>
                              </svg>
                           </button>

                           {/* 100% thickness */}
                           <button className="border border-slate-400 rounded-md bg-slate-200 transition duration-500 hover:scale-125">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000"
                                 viewBox="0 0 24 24"
                                 stroke="#000000"
                                 stroke-width="2.4"
                                 width="40"
                                 height="30"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke="#CCCCCC"
                                    stroke-width="0.096"
                                 ></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path d="M23 13H2v-2h21v2z"></path>
                                 </g>
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* cell border style section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold mb-2">Border Style</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <div>
                           <button className="border border-slate-400 rounded-md bg-slate-200 transition duration-500 hover:scale-125">
                              <svg width="50" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M23 13H1v-2h22z" />
                                 <path fill="none" d="M0 0h24v24H0z" />
                              </svg>
                           </button>
                           <button className="border border-slate-400 rounded-md bg-slate-200 ml-4 mr-4 transition duration-500 hover:scale-125">
                              <svg width="50" height="30" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M0 7.5C0 7.22386 0.223858 7 0.5 7H3C3.27614 7 3.5 7.22386 3.5 7.5C3.5 7.77614 3.27614 8 3 8H0.5C0.223858 8 0 7.77614 0 7.5ZM5.75 7.5C5.75 7.22386 5.97386 7 6.25 7H8.75C9.02614 7 9.25 7.22386 9.25 7.5C9.25 7.77614 9.02614 8 8.75 8H6.25C5.97386 8 5.75 7.77614 5.75 7.5ZM12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12Z"
                                    fill="#000000"
                                 />
                              </svg>
                           </button>
                           <button className="border border-slate-400 rounded-md bg-slate-200 transition duration-500 hover:scale-125">
                              <svg width="50" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M3 11H1V13H3V11Z" fill="#000000" />
                                 <path d="M7 11H5V13H7V11Z" fill="#000000" />
                                 <path d="M9 11H11V13H9V11Z" fill="#000000" />
                                 <path d="M15 11H13V13H15V11Z" fill="#000000" />
                                 <path d="M17 11H19V13H17V11Z" fill="#000000" />
                                 <path d="M23 11H21V13H23V11Z" fill="#000000" />
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* cell position section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold mb-2">Position</div>
                     </div>

                     <div className="items-center gap-3 pl-2">
                        {/* x location input */}
                        <div className="flex mb-1">
                           <div className="w-1/7">X</div>
                           <input
                              value="20"
                              className="w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                              type="text"
                              autoCapitalize="none"
                              autoComplete="both"
                              autoCorrect="off"
                              spellCheck="false"
                              disabled={selectedCellPositionLocked}
                           />
                        </div>

                        {/* y location input */}
                        <div className="flex">
                           <div className="w-1/7">Y</div>
                           <input
                              value="10"
                              className="w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                              type="text"
                              autoCapitalize="none"
                              autoComplete="both"
                              autoCorrect="off"
                              spellCheck="false"
                              disabled={selectedCellPositionLocked}
                           />
                        </div>

                        <div className="flex mt-2.5">
                           <input
                              type="checkbox"
                              className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125"
                              onChange={() => setSelectedCellPositionLocked(!selectedCellPositionLocked)}
                           />
                           <label>Lock position</label>
                        </div>
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* cell size section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold mb-2">Size</div>
                     </div>

                     <div className="items-center gap-3 pl-2">
                        {/* width input */}
                        <div className="flex mb-1">
                           <div className="w-1/4">Width:</div>
                           <input
                              value="20"
                              className="w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                              type="text"
                              autoCapitalize="none"
                              autoComplete="both"
                              autoCorrect="off"
                              spellCheck="false"
                              disabled={selectedCellSizeLocked}
                           />
                        </div>

                        {/* height input */}
                        <div className="flex">
                           <div className="w-1/4">Height:</div>
                           <input
                              value="10"
                              className="w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none"
                              type="text"
                              autoCapitalize="none"
                              autoComplete="both"
                              autoCorrect="off"
                              spellCheck="false"
                              disabled={selectedCellSizeLocked}
                           />
                        </div>

                        <div className="flex mt-2.5">
                           <input
                              type="checkbox"
                              className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125"
                              onChange={() => setSelectedCellSizeLocked(!selectedCellSizeLocked)}
                           />
                           <label>Lock size</label>
                        </div>
                     </div>
                  </div>

                  <hr className="border-slate-400" />

                  {/* cell text style section */}
                  <div className="flex flex-col pt-3 pb-3">
                     <div className="flex justify-between">
                        <div className="font-bold">Text Styling</div>
                     </div>
                     <div className="flex items-center gap-3 pl-2">
                        <div>{/* all of the color options */}</div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
