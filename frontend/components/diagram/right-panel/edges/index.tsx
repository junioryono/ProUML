import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState, useRef, useCallback } from "react";
import ColorPicker from "../styling-options/color-picker";
import { darkColorOptions } from "../styling-options/colors";
import { DashedLine, SolidLine } from "../styling-options/line-styles";
import LineWidth from "../styling-options/line-widths";
import { OpenArrow, OpenDiamond, SolidArrow, SolidDiamond } from "./edge-endings";
import { cn } from "@/lib/utils";

export default function EdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for the left end, middle, and right end of the edge
   const [leftEnd, setLeftEnd] = useState("none");
   const [showLeftEndOptions, setShowLeftEndOptions] = useState(false);
   const [lineStyle, setLineStyle] = useState("solid");
   const [showLineStyleOptions, setShowLineStyleOptions] = useState(false);
   const [rightEnd, setRightEnd] = useState("none");
   const [showRightEndOptions, setShowRightEndOptions] = useState(false);

   const leftEndRef = useRef(null);
   const lineStyleRef = useRef(null);
   const rightEndRef = useRef(null);

   // if the user clicks outside of the left or right end options, close the options
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            leftEndRef.current &&
            !leftEndRef.current.contains(event.target) &&
            lineStyleRef.current &&
            !lineStyleRef.current.contains(event.target) &&
            rightEndRef.current &&
            !rightEndRef.current.contains(event.target)
         ) {
            setShowLeftEndOptions(false);
            setShowLineStyleOptions(false);
            setShowRightEndOptions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [leftEndRef, lineStyleRef, rightEndRef]);

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
         icon: <OpenDiamond direction="left" />,
      },
      {
         value: "solid diamond",
         icon: <SolidDiamond direction="left" />,
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
         icon: <OpenDiamond direction="right" />,
      },
      {
         value: "solid diamond",
         icon: <SolidDiamond direction="right" />,
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

   // for the edge labels
   const [upperLeftLabel, setUpperLeftLabel] = useState("");
   const [lowerLeftLabel, setLowerLeftLabel] = useState("");
   const [centerLabel, setCenterLabel] = useState("");
   const [upperRightLabel, setUpperRightLabel] = useState("");
   const [lowerRightLabel, setLowerRightLabel] = useState("");

   // the selected cells
   const [selectedEdges, setSelectedEdges] = useState<X6Type.Edge[]>([]);

   const getSelectedEdges = () => {
      const selectedCells = graph.current?.getSelectedCells();
      const newSelectedEdges: X6Type.Edge[] = [];
      const selectedColors = [];
      const selectedWidths = [];

      for (const cell of selectedCells) {
         if (cell.isEdge()) {
            newSelectedEdges.push(cell);

            const color = cell.getProp("attrs/line/stroke");
            if (color) {
               selectedColors.push(color);
            }

            const width = cell.getProp("attrs/line/strokeWidth");
            if (width) {
               selectedWidths.push(width);
            }
         }
      }
      setSelectedEdges(newSelectedEdges);
   };

   const setColorFunction = useCallback(
      (color: string) => {
         setColor(color);
         for (const edge of selectedEdges) {
            edge.trigger("change:color", {
               current: color,
            });
         }
      },
      [selectedEdges],
   );

   const setWidthFunction = useCallback(
      (width: number) => {
         setWidth(width);
         for (const edge of selectedEdges) {
            edge.trigger("change:width", {
               current: width,
            });
         }
      },
      [selectedEdges],
   );

   useEffect(() => {
      getSelectedEdges();

      graph.current?.on("cell:selected", () => {
         getSelectedEdges();
      });

      graph.current?.on("cell:unselected", () => {
         getSelectedEdges();
      });
   }, [graph]);

   return (
      <>
         {/* ---------------------- EDGE SETTINGS SECTION ---------------------- */}

         <div className="font-bold mb-1">Edge Settings</div>

         <div className="flex flex-col pb-3">
            <div className="w-full flex justify-between px-2 mb-1">
               {/* left upper label input */}
               <div className="justify-start">
                  <input
                     type="text"
                     className={cn(
                        "h-6 w-11 text-center block rounded-md border text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        upperLeftLabel === ""
                           ? "border-2 border-dotted bg-slate-100 border-slate-400"
                           : "bg-slate-200 border-slate-300",
                     )}
                     value={upperLeftLabel}
                     onChange={(e) => setUpperLeftLabel(e.target.value)}
                  />
               </div>

               {/* center label input */}
               <div className="justify-center">
                  <input
                     type="text"
                     className={cn(
                        "h-6 w-16 text-center block rounded-md border text-xs font-bold focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        centerLabel === ""
                           ? "border-2 border-dotted bg-slate-100 border-slate-400"
                           : "bg-slate-200 border-slate-300",
                     )}
                     value={centerLabel}
                     onChange={(e) => setCenterLabel(e.target.value)}
                  />
               </div>

               {/* right upper label input */}
               <div className="justify-end">
                  <input
                     type="text"
                     className={cn(
                        "h-6 w-11 text-center block rounded-md border text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        upperRightLabel === ""
                           ? "border-2 border-dotted bg-slate-100 border-slate-400"
                           : "bg-slate-200 border-slate-300",
                     )}
                     value={upperRightLabel}
                     onChange={(e) => setUpperRightLabel(e.target.value)}
                  />
               </div>
            </div>

            <div className="w-full flex justify-center items-center gap-2 mb-1">
               {/* left ending dropdown */}
               <div ref={leftEndRef}>
                  <div
                     className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14 justify-center items-center flex cursor-pointer"
                     onClick={() => {
                        setShowLeftEndOptions(!showLeftEndOptions);
                        setShowRightEndOptions(false);
                        setShowLineStyleOptions(false);
                     }}
                  >
                     {/* show the icon of the selected ending */}
                     <div className="flex w-7 items-center justify-center">
                        {/* if the value is not none don't show any icon */}
                        {leftEnd !== "none" && leftEndingOptions.find((option) => option.value === leftEnd)?.icon}
                     </div>
                     <div className="w-1/3">
                        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="cursor-pointer">
                           <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                     </div>
                  </div>

                  {showLeftEndOptions && (
                     <div className="absolute top-34 mt-0.5 right-36 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {leftEndingOptions.map((option) => (
                           <button
                              key={option.value}
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

                                 // don't show the dropdown anymore
                                 setShowLeftEndOptions(false);
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
               <div ref={lineStyleRef}>
                  <div
                     className="w-22 flex my-0 h-8 rounded-md border bg-slate-200 border-slate-400 py-3 px-3 text-md items-center justify-center focus:outline-none hover:border-slate-500"
                     onClick={() => {
                        setShowLineStyleOptions(!showLineStyleOptions);
                        setShowLeftEndOptions(false);
                        setShowRightEndOptions(false);
                     }}
                  >
                     <div className="flex items-center justify-center w-5/6">
                        {lineStyleOptions.find((option) => option.value === lineStyle)?.icon}
                     </div>
                     <div className="w-1/6">
                        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="cursor-pointer">
                           <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                     </div>
                  </div>

                  {showLineStyleOptions && (
                     <div className="absolute top-34 mt-0.5 right-18 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {lineStyleOptions.map((option) => (
                           <button
                              key={option.value}
                              className="transform hover:bg-slate-300 transition duration-500 w-20 h-8 flex justify-center items-center rounded-md"
                              onClick={() => {
                                 // if the leftEnd is not the same as the option value, set the left end to the option value
                                 if (lineStyle !== option.value) {
                                    setLineStyle(option.value);
                                 }

                                 // don't show the dropdown anymore
                                 setShowLineStyleOptions(false);
                              }}
                           >
                              {/* if this option is currently selected put a checkmark next to it */}
                              <div className="w-6">
                                 {lineStyle === option.value && (
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

               {/* right ending dropdown */}
               <div ref={rightEndRef}>
                  <div
                     className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14 justify-center items-center flex cursor-pointer"
                     onClick={() => {
                        setShowRightEndOptions(!showRightEndOptions);
                        setShowLeftEndOptions(false);
                        setShowLineStyleOptions(false);
                     }}
                  >
                     {/* show the icon of the selected ending */}
                     <div className="flex w-7 items-center justify-center">
                        {/* if the value is not none don't show any icon */}
                        {rightEnd !== "none" && rightEndingOptions.find((option) => option.value === rightEnd)?.icon}
                     </div>
                     <div className="w-1/3">
                        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" className="cursor-pointer">
                           <path d="M7 10l5 5 5-5H7z"></path>
                        </svg>
                     </div>
                  </div>

                  {showRightEndOptions && (
                     <div className="absolute top-34 mt-0.5 right-1 z-10 bg-slate-100 border border-slate-400 rounded-md p-1 shadow-2xl">
                        {/* map out all of the left ending options */}
                        {rightEndingOptions.map((option) => (
                           <button
                              key={option.value}
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

                                 // don't show the dropdown anymore
                                 setShowRightEndOptions(false);
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
            <div className="w-full flex justify-between px-2">
               {/* left lower label input */}
               <div className="justify-start">
                  <input
                     type="text"
                     className={cn(
                        "h-6 w-11 text-center block rounded-md border text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        lowerLeftLabel === ""
                           ? "border-2 border-dotted bg-slate-100 border-slate-400"
                           : "bg-slate-200 border-slate-300",
                     )}
                     value={lowerLeftLabel}
                     onChange={(e) => setLowerLeftLabel(e.target.value)}
                  />
               </div>

               {/* right lower label input */}
               <div className="justify-end">
                  <input
                     type="text"
                     className={cn(
                        "h-6 w-11 text-center block rounded-md border text-xs focus:outline-none hover:border-slate-400 focus:border-slate-400",
                        lowerRightLabel === ""
                           ? "border-2 border-dotted bg-slate-100 border-slate-400"
                           : "bg-slate-200 border-slate-300",
                     )}
                     value={lowerRightLabel}
                     onChange={(e) => setLowerRightLabel(e.target.value)}
                  />
               </div>
            </div>
         </div>

         <hr className="border-slate-400" />

         {/* ---------------------- RELATED CLASSES SECTION ---------------------- */}

         {/* TODO: show related classes??? */}
         {/* {selectedCells.length === 1 && <EdgeSettings edge={selectedCells[0] as X6Type.Edge} graph={graph} />} */}

         {/* ---------------------- LINE COLOR SECTION ---------------------- */}
         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold">Color</div>
            <ColorPicker
               colorOptions={darkColorOptions}
               indicatorColor={"white"}
               objColor={color}
               setObjColor={setColorFunction}
            />
         </div>
         <hr className="border-slate-400" />

         {/*---------------------- LINE WIDTH SECTION ---------------------- */}
         {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}

         <div className="flex flex-col pt-1.5 pb-3">
            <div className="font-bold mb-1">Width</div>
            <LineWidth lineWidth={width} setLineWidth={setWidthFunction} />
         </div>
      </>
   );
}
