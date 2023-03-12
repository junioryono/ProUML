import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
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
               <select
                  className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14"
                  value={leftEnd}
                  onClick={() => setShowLeftEndOptions(!showLeftEndOptions)}
               >
                  {leftEndingOptions.map((option) => (
                     <option value={option.value}>{option.icon}</option>
                  ))}
               </select>

               <div className="w-20 flex my-0 h-8 rounded-md border bg-slate-200 border-slate-400 py-3 px-3 text-md justify-center items-center focus:outline-none">
                  {lineStyleOptions.find((option) => option.value === lineStyle)?.icon}
               </div>

               {/* right ending dropdown */}
               <select
                  className="border border-slate-400 rounded-md bg-slate-200 hover:border-slate-500 h-8 w-14"
                  value={rightEnd}
                  onClick={() => setShowRightEndOptions(!showRightEndOptions)}
               >
                  {rightEndingOptions.map((option) => (
                     <option value={option.value}>{option.icon}</option>
                  ))}
               </select>
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
