import type X6Type from "@antv/x6";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { ClassNode } from "types";
import { lightColorOptions, darkColorOptions } from "../styling-options/colors";
import ColorPicker from "../styling-options/color-picker";
import LineWidth from "../styling-options/line-width";
import NodeSettings from "./node-settings";

export default function NodesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for current background & border colors of selected cell
   const [backgroundColor, setBackgroundColor] = useState<string>(); // <- default should be initial bg color
   const [borderColor, setBorderColor] = useState<string>(); // <- default should be initial border color

   // for current line width & style of selected cell
   const [borderWidth, setBorderWidth] = useState<number>(); // <- default should be initial border width
   const [borderStyle, setBorderStyle] = useState<string>(); // <- default should be initial border style

   // the selected cells
   const [selectedNodes, setSelectedNodes] = useState<X6Type.Node[]>([]);

   // when selecting cells, update the selected cells
   const getSelectedNodes = () => {
      const selectedCells = graph.current?.getSelectedCells();
      const newSelectedNodes: X6Type.Node[] = [];
      const selectedBgColors = [];
      const selectedBdColors = [];
      const selectedBdWidths = [];
      const selectedBdStyles = [];
      for (const cell of selectedCells) {
         if (cell.isNode()) {
            newSelectedNodes.push(cell);

            const bgColor = cell.getProp("backgroundColor");
            if (bgColor) {
               selectedBgColors.push(bgColor);
            }

            const bdColor = cell.getProp("borderColor");
            if (bdColor) {
               selectedBdColors.push(bdColor);
            }

            const bdWidth = cell.getProp("borderWidth");
            if (bdWidth) {
               selectedBdWidths.push(bdWidth);
            }

            const bdStyle = cell.getProp("borderStyle");
            if (bdStyle) {
               selectedBdStyles.push(bdStyle);
            }
         }
      }
      setSelectedNodes(newSelectedNodes);

      // Check if all selected cells have the same background color
      if (selectedBgColors.every((color) => color === selectedBgColors[0])) {
         setBackgroundColor(selectedBgColors[0]);
      } else {
         setBackgroundColor("Multiple");
      }

      // Check if all selected cells have the same border color
      if (selectedBdColors.every((color) => color === selectedBdColors[0])) {
         setBorderColor(selectedBdColors[0]);
      } else {
         setBorderColor("Multiple");
      }

      // Check if all selected cells have the same border width
      if (selectedBdWidths.every((width) => width === selectedBdWidths[0])) {
         setBorderWidth(selectedBdWidths[0]);
      } else {
         setBorderWidth(-1);
      }

      // Check if all selected cells have the same border style
      if (selectedBdStyles.every((style) => style === selectedBdStyles[0])) {
         setBorderStyle(selectedBdStyles[0]);
      } else {
         setBorderStyle("Multiple");
      }
   };

   useEffect(() => {
      // set the selected cells to the current selected cells
      getSelectedNodes();

      // when a cell is selected, update the selected cells
      graph.current?.on("cell:selected", () => {
         getSelectedNodes();
      });

      // when a cell is unselected, update the selected cells
      graph.current?.on("cell:unselected", () => {
         getSelectedNodes();
      });
   }, [graph]);

   // useCallback on setBackgroundColor
   const setBackgroundColorFunction = useCallback(
      (color: string) => {
         setBackgroundColor(color);
         for (const node of selectedNodes) {
            node.trigger("change:backgroundColor", {
               backgroundColor: color,
            });
         }
      },
      [selectedNodes],
   );

   const setBorderColorFunction = useCallback(
      (color: string) => {
         setBorderColor(color);
         for (const node of selectedNodes) {
            node.trigger("change:borderColor", {
               borderColor: color,
            });
         }
      },
      [selectedNodes],
   );

   const setBorderWidthFunction = useCallback(
      (width: number) => {
         setBorderWidth(width);
         for (const node of selectedNodes) {
            const currentBorderWidth = node.getProp("borderWidth") || 1;
            const newHeight = node.size().height + (width - currentBorderWidth) * 4;
            node.trigger("change:borderWidth", {
               borderWidth: width,
               newHeight: newHeight,
            });
         }
      },
      [selectedNodes],
   );

   const setBorderStyleFunction = useCallback(
      (style: string) => {
         setBorderStyle(style);
         for (const node of selectedNodes) {
            node.trigger("change:borderStyle", {
               borderStyle: style,
            });
         }
      },
      [selectedNodes],
   );

   useEffect(() => {
      for (const node of selectedNodes) {
         node.on("change:backgroundColor", (args) => {
            setBackgroundColor(args.backgroundColor);
         });
         node.on("change:borderColor", (args) => {
            setBorderColor(args.borderColor);
         });
         node.on("change:borderWidth", (args) => {
            setBorderWidth(args.borderWidth);
         });
         node.on("change:borderStyle", (args) => {
            setBorderStyle(args.borderStyle);
         });
      }
   }, [selectedNodes]);

   return (
      <>
         <div className="w-56">
            {/* ---------------------- NODE SETTINGS SECTION ---------------------- */}
            {selectedNodes.length === 1 && <NodeSettings node={selectedNodes[0] as X6Type.Node} graph={graph} />}

            {/* ---------------------- BACKGROUND COLOR SECTION ---------------------- */}
            <div className="flex flex-col pb-3">
               <div className="flex justify-between">
                  <div className="font-bold">Background Color</div>
               </div>

               {/* all of the background color options */}
               <ColorPicker
                  colorOptions={lightColorOptions}
                  indicatorColor={"black"}
                  objColor={backgroundColor}
                  setObjColor={setBackgroundColorFunction}
               />
            </div>
            <hr className="border-slate-400" />

            {/* ---------------------- BORDER COLOR SECTION ---------------------- */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold">Border Color</div>
               </div>

               {/* all of the border color options */}
               <ColorPicker
                  colorOptions={darkColorOptions}
                  indicatorColor={"white"}
                  objColor={borderColor}
                  setObjColor={setBorderColorFunction}
               />
            </div>
            <hr className="border-slate-400" />

            {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
            {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold mb-1">Border Width</div>
               </div>

               <LineWidth lineWidth={borderWidth} setLineWidth={setBorderWidthFunction} />
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
                     onClick={() => setBorderStyleFunction("solid")}
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
                     onClick={() => setBorderStyleFunction("double")}
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
                     onClick={() => setBorderStyleFunction("dashed")}
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
                     onClick={() => setBorderStyleFunction("dotted")}
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
         </div>
      </>
   );
}
