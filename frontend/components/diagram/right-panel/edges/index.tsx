import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState, useRef } from "react";
import ColorPicker from "../styling-options/color-picker";
import { darkColorOptions } from "../styling-options/colors";
import { DashedLine, SolidLine } from "../styling-options/line-styles";
import LineWidth from "../styling-options/line-width";
import { OpenArrow, OpenDiamond, SolidArrow, SolidDiamond } from "./edge-endings";

export default function EdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for the left end, middle, and right end of the edge
   const [leftEnd, setLeftEnd] = useState("none");
   const [showLeftEndOptions, setShowLeftEndOptions] = useState(false);
   const [lineStyle, setLineStyle] = useState("solid");
   const [rightEnd, setRightEnd] = useState("none");
   const [showRightEndOptions, setShowRightEndOptions] = useState(false);

   const leftEndRef = useRef(null);
   const rightEndRef = useRef(null);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            leftEndRef.current &&
            !leftEndRef.current.contains(event.target) &&
            rightEndRef.current &&
            !rightEndRef.current.contains(event.target)
         ) {
            setShowLeftEndOptions(false);
            setShowRightEndOptions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [leftEndRef, rightEndRef]);

   const leftEndingOptions = [
      {
         value: "none",
         icon: "None",
      },
      {
         value: "open arrow",
         icon: <OpenArrow direction="left" />,
      },
      {
         value: "solid arrow",
         icon: <SolidArrow direction="left" />,
      },
      {
         value: "open diamond",
         icon: <OpenDiamond />,
      },
      {
         value: "solid diamond",
         icon: <SolidDiamond />,
      },
   ];

   const rightEndingOptions = [
      {
         value: "none",
         icon: "None",
      },
      {
         value: "open arrow",
         icon: <OpenArrow direction="right" />,
      },
      {
         value: "solid arrow",
         icon: <SolidArrow direction="right" />,
      },
      {
         value: "open diamond",
         icon: <OpenDiamond />,
      },
      {
         value: "solid diamond",
         icon: <SolidDiamond />,
      },
   ];

   // for the line style options
   const lineStyleOptions = [
      {
         value: "solid",
         icon: <SolidLine />,
      },
      {
         value: "dashed",
         icon: <DashedLine />,
      },
   ];

   // for current background & border colors of selected line
   const [color, setColor] = useState("000000"); // <- default should be initial border color

   // for current line width selected cell
   const [width, setWidth] = useState(1); // <- default should be initial border width

   // if selected cell currently has rounded corners or not
   const [roundedIntensity, setRoundedIntensity] = useState(0); // no roundness -> 0% intensity

   // the selected cells
   const [selectedCells, setSelectedCells] = useState<X6Type.Cell[]>([]);

   // when selecting cells, update the selected cells
   useEffect(() => {
      // set the selected cells to the current selected cells
      setSelectedCells(graph.current?.getSelectedCells());

      // when a cell is selected, update the selected cells
      graph.current?.on("cell:selected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });

      // when a cell is unselected, update the selected cells
      graph.current?.on("cell:unselected", () => {
         setSelectedCells(graph.current?.getSelectedCells());
      });
   }, [graph]);

   return (
      <>
         {/* ---------------------- EDGE SETTINGS SECTION ---------------------- */}

         <div className="font-bold mb-1">Edge Settings</div>

         <div className="flex flex-col pb-3">
            <div className="w-full flex justify-center items-center gap-1 mb-2">
               {/* left ending dropdown */}
               <div ref={leftEndRef}>
                  <div
                     className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14 justify-center items-center flex cursor-pointer"
                     onClick={() => {
                        setShowLeftEndOptions(!showLeftEndOptions);
                        setShowRightEndOptions(false);
                     }}
                  >
                     {/* show the icon of the selected ending */}
                     <div className="w-2/3">
                        {/* if the value is not none don't show any icon */}
                        {leftEnd !== "none" && leftEndingOptions.find((option) => option.value === leftEnd)?.icon}
                     </div>
                     <div className="w-1/3">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <rect x="0" fill="none" width="24" height="24"></rect>
                              <g>
                                 <path d="M7 10l5 5 5-5"></path>
                              </g>
                           </g>
                        </svg>
                     </div>
                  </div>

                  {showLeftEndOptions && (
                     <div className="absolute top-28 mt-0.5 right-36 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {leftEndingOptions.map((option, index) => (
                           <button
                              key={index}
                              className="transform hover:bg-slate-300 transition duration-500 w-20 h-8 flex justify-center items-center rounded-md"
                              onClick={() => {
                                 // if the leftEnd is not the same as the option value, set the left end to the option value
                                 if (leftEnd !== option.value) {
                                    setLeftEnd(option.value);
                                    // if the right end has a val other than none, set the the right end to none
                                    if (rightEnd !== "none") {
                                       setRightEnd("none");
                                    }
                                 }
                              }}
                           >
                              {/* if this option is currently selected put a checkmark next to it */}
                              <div className="w-6">
                                 {leftEnd === option.value && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 25 25">
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 )}
                              </div>
                              {option.icon}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* line style indicator */}
               <div className="w-20 flex my-0 h-8 rounded-md border bg-slate-200 border-slate-400 py-3 px-3 text-md justify-center items-center focus:outline-none">
                  {lineStyleOptions.find((option) => option.value === lineStyle)?.icon}
               </div>

               {/* right ending dropdown */}
               <div ref={rightEndRef}>
                  <div
                     className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14 justify-center items-center flex cursor-pointer"
                     onClick={() => {
                        setShowRightEndOptions(!showRightEndOptions);
                        setShowLeftEndOptions(false);
                     }}
                  >
                     {/* show the icon of the selected ending */}
                     <div className="w-2/3">
                        {/* if the value is not none don't show any icon */}
                        {rightEnd !== "none" && rightEndingOptions.find((option) => option.value === rightEnd)?.icon}
                     </div>
                     <div className="w-1/3">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <rect x="0" fill="none" width="24" height="24"></rect>
                              <g>
                                 <path d="M7 10l5 5 5-5"></path>
                              </g>
                           </g>
                        </svg>
                     </div>
                  </div>

                  {showRightEndOptions && (
                     <div className="absolute top-28 mt-0.5 right-1 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {rightEndingOptions.map((option, index) => (
                           <button
                              key={index}
                              className="transform hover:bg-slate-300 transition duration-500 w-20 h-8 flex justify-center items-center rounded-md"
                              onClick={() => {
                                 // if the rightEnd is not the same as the option value, set the right end to the option value
                                 if (rightEnd !== option.value) {
                                    setRightEnd(option.value);
                                    // if the right end has a val other than none, set the the right end to none
                                    if (leftEnd !== "none") {
                                       setLeftEnd("none");
                                    }
                                 }
                              }}
                           >
                              {/* if this option is currently selected put a checkmark next to it */}
                              <div className="w-6">
                                 {rightEnd === option.value && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 25 25">
                                       <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                    </svg>
                                 )}
                              </div>

                              {option.icon}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            {/* line style options */}
            <div className="w-full flex justify-center items-center gap-1.5">
               {/* map out all of the line style option buttons */}
               {lineStyleOptions.map((option, index) => (
                  <button
                     key={index}
                     className={`border rounded-md transition duration-500 hover:scale-125
                     ${lineStyle !== option.value ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setLineStyle(option.value)}
                  >
                     {option.icon}
                  </button>
               ))}
            </div>
         </div>

         <hr className="border-slate-400" />

         {/* ---------------------- RELATED CLASSES SECTION ---------------------- */}

         {/* TODO: show related classes??? */}
         {/* {selectedCells.length === 1 && <EdgeSettings edge={selectedCells[0] as X6Type.Edge} graph={graph} />} */}

         {/* ---------------------- LINE COLOR SECTION ---------------------- */}
         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold">Color</div>
            <ColorPicker colorOptions={darkColorOptions} indicatorColor={"white"} objColor={color} setObjColor={setColor} />
         </div>
         <hr className="border-slate-400" />

         {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
         {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}

         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold mb-1">Width</div>
            <LineWidth lineWidth={width} setLineWidth={setWidth} />
         </div>
         <hr className="border-slate-400" />
      </>
   );
}
