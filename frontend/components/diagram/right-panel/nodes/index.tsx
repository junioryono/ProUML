import { ScrollFade } from "@/components/scroll-fade";
import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ClassNode } from "types";
import { lightColorOptions, darkColorOptions } from "..";
import ColorPicker from "../styling-options/color-picker";
import LineWidth from "../styling-options/line-width";
import NodeSettings from "./node-settings";

export default function NodesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for current background & border colors of selected cell
   const [backgroundColor, setBackgroundColor] = useState("FFFFFF"); // <- default should be initial bg color
   const [borderColor, setBorderColor] = useState("000000"); // <- default should be initial border color

   // for current line width & style of selected cell
   const [borderWidth, setBorderWidth] = useState(1); // <- default should be initial border width
   const [borderStyle, setBorderStyle] = useState("solid"); // <- default should be initial border style

   // if selected cell currently has a shadow or not
   const [shadowIntensity, setShadowIntensity] = useState(0); // no shadow -> 0% intensity

   // if selected cell currently has rounded corners or not
   const [roundedIntensity, setRoundedIntensity] = useState(0); // no roundness -> 0% intensity

   // the selected cells
   const [selectedCells, setSelectedCells] = useState<X6Type.Cell[]>([]);

   // when the background color changes, change the background color of all selected cells
   useEffect(() => {
      selectedCells.forEach((node) => {
         node.attr("body", {
            fill: `#${backgroundColor}`,
         });
      });
   }, [backgroundColor]);

   // when the border color changes, change the border color of all selected cells
   useEffect(() => {
      selectedCells.forEach((node) => {
         node.attr("body", {
            stroke: `#${borderColor}`,
         });
      });
   }, [borderColor]);

   // when the border width changes, change the border width of all selected cells
   useEffect(() => {
      selectedCells.forEach((node) => {
         node.attr("body", {
            strokeWidth: borderWidth,
         });
      });
   }, [borderWidth]);

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

      // remove all event listeners
      const graphRef = graph.current;
      return () => {
         // graphRef?.off("cell:selected");
         // graphRef?.off("cell:unselected");
      };
   }, [graph]);

   return (
      <>
         <div className="w-56">
            {/* ---------------------- NODE SETTINGS SECTION ---------------------- */}
            {selectedCells.length === 1 && <NodeSettings node={selectedCells[0] as X6Type.Node} graph={graph} />}

            {/* ---------------------- BACKGROUND COLOR SECTION ---------------------- */}
            <div className="flex flex-col pb-3">
               <div className="flex justify-between">
                  <div className="font-bold">Background Color</div>
               </div>

               {/* all of the background color options */}
               <ColorPicker colorOptions={lightColorOptions} objColor={backgroundColor} setObjColor={setBackgroundColor} />
            </div>
            <hr className="border-slate-400" />

            {/* ---------------------- BORDER COLOR SECTION ---------------------- */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold">Border Color</div>
               </div>

               {/* all of the border color options */}
               <ColorPicker colorOptions={darkColorOptions} objColor={borderColor} setObjColor={setBorderColor} />
            </div>
            <hr className="border-slate-400" />

            {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
            {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold mb-1">Border Width</div>
               </div>

               <LineWidth lineWidth={borderWidth} setLineWidth={setBorderWidth} />
            </div>
            <hr className="border-slate-400" />

            {/* ---------------------- BORDER STYLE SECTION ---------------------- */}
            <div className="flex flex-col pt-1.5">
               <div className="flex justify-between">
                  <div className="font-bold mb-1">Border Style</div>
               </div>
               <div className="flex items-center gap-2 pl-1.5">
                  {/* solid line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
     ${borderStyle !== "solid" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderStyle("solid")}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="0.00017"
                        width="40"
                        height="25"
                     >
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />
                        <g
                           id="SVGRepo_tracerCarrier"
                           stroke-linecap="round"
                           stroke-linejoin="round"
                           stroke="#CCCCCC"
                           stroke-width="0.068"
                        />
                        <g id="SVGRepo_iconCarrier">
                           <path d="M17 8v1h-17v-1h17z" fill="#000000" />
                        </g>
                     </svg>
                  </button>

                  {/* double line svg source: https://www.svgrepo.com/svg/409213/line-double */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
     ${borderStyle !== "double" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderStyle("double")}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        width="40"
                        height="25"
                     >
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                           <path d="M17 6v1h-17v-1h17zM0 10h17v-1h-17v1z" fill="#000000" />
                        </g>
                     </svg>
                  </button>

                  {/* dashed line svg source: https://www.svgrepo.com/svg/361694/border-dashed */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
        ${borderStyle !== "dashed" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderStyle("dashed")}
                  >
                     <svg width="40" height="25" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                           fillRule="evenodd"
                           clipRule="evenodd"
                           d="M0 7.5C0 7.22386 0.223858 7 0.5 7H3C3.27614 7 3.5 7.22386 3.5 7.5C3.5 7.77614 3.27614 8 3 8H0.5C0.223858 8 0 7.77614 0 7.5ZM5.75 7.5C5.75 7.22386 5.97386 7 6.25 7H8.75C9.02614 7 9.25 7.22386 9.25 7.5C9.25 7.77614 9.02614 8 8.75 8H6.25C5.97386 8 5.75 7.77614 5.75 7.5ZM12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12Z"
                           fill="#000000"
                        />
                     </svg>
                  </button>

                  {/* dotted line svg source: https://www.svgrepo.com/svg/451059/line-dotted */}
                  <button
                     className={`border border-slate-400 rounded-md bg-slate-200 transition duration-500 hover:scale-125
        ${borderStyle !== "dotted" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderStyle("dotted")}
                  >
                     <svg width="40" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 11H1V13H3V11Z" fill="#000000" />
                        <path d="M7 11H5V13H7V11Z" fill="#000000" />
                        <path d="M9 11H11V13H9V11Z" fill="#000000" />
                        <path d="M15 11H13V13H15V11Z" fill="#000000" />
                        <path d="M17 11H19V13H17V11Z" fill="#000000" />
                        <path d="M23 11H21V13H23V11Z" fill="#000000" />
                     </svg>
                  </button>
               </div>

               <div className="flex mt-2">
                  {/* shadow toggle */}
                  <div className="flex mt-5 h-8 w-24">
                     <input
                        id="shadow-toggle"
                        type="checkbox"
                        className="mr-2 w-5 h-5 border-slate-200 accent-black transition duration-500 hover:scale-125"
                        onChange={() => {
                           if (shadowIntensity === 0) setShadowIntensity(50);
                           else setShadowIntensity(0);
                        }}
                        checked={shadowIntensity !== 0}
                     />
                     <label htmlFor="shadow-toggle">Shadow</label>
                  </div>

                  {/* shadow intensity slider */}
                  <div className="flex-1 mx-auto mr-3">
                     <div className="text-center">Intensity</div>
                     <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadowIntensity}
                        className="w-full bg-slate-300 rounded-full h-2 appearance-none focus:outline-none"
                        onChange={(e) => {
                           setShadowIntensity(parseInt(e.target.value));
                        }}
                     />
                  </div>
                  <style>
                     {`
                     input[type="range"]::-webkit-slider-thumb {
                        height: 1.2rem;
                        width: 1.2rem;
                        background-color: #fff;
                        border: 1px solid #475569;
                        border-radius: 1.5rem;
                        cursor: pointer;
                        -webkit-appearance: none;

                        transform: scale(1);
                        transition: transform 0.2s ease-in-out;

                        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
                     }

                     input[type="range"]:hover::-webkit-slider-thumb {
                        transform: scale(1.5);
                        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.3);
                     }
                  `}
                  </style>
               </div>

               <div className="flex">
                  {/* rounded toggle */}
                  <div className="flex h-8 w-24">
                     <input
                        id="rounded-toggle"
                        type="checkbox"
                        className="mr-2 w-5 h-5 border-slate-300 accent-black transition duration-500 hover:scale-125"
                        onChange={() => {
                           if (roundedIntensity === 0) setRoundedIntensity(50);
                           else setRoundedIntensity(0);
                        }}
                        checked={roundedIntensity !== 0}
                     />
                     <label htmlFor="rounded-toggle">Rounded</label>
                  </div>

                  {/* rounded intensity slider */}
                  <div className="flex-1 mx-auto mr-3">
                     <input
                        type="range"
                        min="0"
                        max="100"
                        value={roundedIntensity}
                        className="w-full bg-slate-300 rounded-full h-2 appearance-none focus:outline-none"
                        onChange={(e) => setRoundedIntensity(parseInt(e.target.value))}
                     />
                  </div>
                  <style>
                     {`
                     input[type="range"]::-webkit-slider-thumb {
                        height: 1.2rem;
                        width: 1.2rem;
                        background-color: #fff;
                        border: 1px solid #475569;
                        border-radius: 1.5rem;
                        cursor: pointer;
                        -webkit-appearance: none;

                        transform: scale(1);
                        transition: transform 0.2s ease-in-out;

                        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2);
                     }

                     input[type="range"]:hover::-webkit-slider-thumb {
                        transform: scale(1.5);
                        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.3);
                     }
                  `}
                  </style>
               </div>
            </div>
         </div>
      </>
   );
}
