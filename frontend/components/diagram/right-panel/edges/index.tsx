import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import ColorPicker from "../styling-options/color-picker";
import { darkColorOptions } from "../styling-options/colors";
import LineWidth from "../styling-options/line-width";
import EdgeSettings from "./edge-settings";

export default function EdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for current background & border colors of selected line
   const [color, setColor] = useState("000000"); // <- default should be initial border color

   // for current line width & style of selected cell
   const [width, setWidth] = useState(1); // <- default should be initial border width
   const [style, setStyle] = useState("solid"); // <- default should be initial border style

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

         <div className="flex flex-col pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-1">Edge Settings</div>
            </div>
            <div className="flex items-center gap-2 pl-1.5">
               {/* solid line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125
                    ${style !== "solid" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setStyle("solid")}
               >
                  <svg
                     viewBox="0 0 17 17"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="#000000"
                     stroke="#000000"
                     strokeWidth="0.00017"
                     width="40"
                     height="25"
                  >
                     <g strokeWidth="0" />
                     <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
                     <g>
                        <path d="M17 8v1h-17v-1h17z" fill="#000000" />
                     </g>
                  </svg>
               </button>

               {/* dashed line svg source: https://www.svgrepo.com/svg/361694/border-dashed */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125
                    ${style !== "dashed" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setStyle("dashed")}
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
                    ${style !== "dotted" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setStyle("dotted")}
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
         </div>

         <hr className="border-slate-400" />

         {/* ---------------------- RELATED CLASSES SECTION ---------------------- */}

         {/* TODO: show related classes??? */}
         {/* {selectedCells.length === 1 && <EdgeSettings edge={selectedCells[0] as X6Type.Edge} graph={graph} />} */}

         {/* ---------------------- LINE COLOR SECTION ---------------------- */}
         <div className="flex flex-col pt-1.5 pb-3">
            <div className="flex justify-between">
               <div className="font-bold">Color</div>
            </div>
            <ColorPicker colorOptions={darkColorOptions} indicatorColor={"white"} objColor={color} setObjColor={setColor} />
         </div>
         <hr className="border-slate-400" />

         {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
         {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}

         <div className="flex flex-col pt-1.5 pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-1">Width</div>
            </div>

            <LineWidth lineWidth={width} setLineWidth={setWidth} />
         </div>
         <hr className="border-slate-400" />
      </>
   );
}
