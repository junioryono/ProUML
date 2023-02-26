import { ScrollFade } from "@/components/scroll-fade";
import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ClassNode } from "types";
import { lightColorOptions, darkColorOptions } from ".";

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
               <div className="flex items-center gap-2">
                  <div>
                     {lightColorOptions.map((color) => {
                        return (
                           // if the current bg color is set to this color, put a checkmark svg on it
                           <button
                              key={color}
                              style={{ color: `#${color}` }}
                              className={
                                 "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                              }
                              onClick={() => {
                                 if (color !== backgroundColor) {
                                    setBackgroundColor(color);

                                    // change the background color of all selected cells
                                    selectedCells.forEach((node) => {
                                       node.setProp("attrs/body/fill", `#${color}`);
                                    });
                                 }
                              }}
                           >
                              {/* checkmark svg source: https://www.svgrepo.com/svg/452247/checkmark */}
                              {color === backgroundColor && (
                                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25">
                                    <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                 </svg>
                              )}
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* the current color hex code of the box */}
               <div className="mt-1  w-full flex">
                  <div
                     style={{ color: `#${backgroundColor}` }}
                     className={`ml-10 mr-1 border border-black rounded-md h-6.1 w-7 bg-current`}
                  />
                  <input
                     value={`#${backgroundColor} `}
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
            {/* ---------------------- BORDER COLOR SECTION ---------------------- */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold">Border Color</div>
               </div>
               <div className="flex   items-center gap-2">
                  <div>
                     {/* all of the color options */}
                     {darkColorOptions.map((color) => {
                        // if the current collor
                        return (
                           <button
                              key={color}
                              style={{ color: `#${color}` }}
                              className={
                                 "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                              }
                              onClick={() => {
                                 if (color !== borderColor) {
                                    setBorderColor(color);

                                    // edit the border color of the selected node(s), which is a custom shape
                                    graph.current?.getSelectedCells().forEach((node) => {
                                       node.attr("body/stroke", `#${color}`);
                                    });
                                 }
                              }}
                           >
                              {color === borderColor && (
                                 <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 25 25"
                                    fill="white"
                                 >
                                    <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                 </svg>
                              )}
                           </button>
                        );
                     })}
                  </div>
               </div>

               {/* the current color hex code of the cell */}
               <div className="mt-1 w-full flex">
                  <div
                     style={{ color: `#${borderColor}` }}
                     className={"ml-10 mr-1 border border-black rounded-md h-6.1 w-7 bg-current"}
                  />
                  <input
                     value={`#${borderColor} `}
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

            {/*---------------------- BORDER WIDTH SECTION ---------------------- */}
            {/* line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true */}
            <div className="flex flex-col pt-1.5 pb-3">
               <div className="flex justify-between">
                  <div className="font-bold mb-1">Border Width</div>
               </div>
               <div className="flex items-center gap-1.5 pl-2">
                  {/* 0% thickness */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125 
        ${borderWidth !== 1 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => {
                        setBorderWidth(1);

                        // change the border width of the selected cell(s)
                     }}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="0.00017"
                        width="35"
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

                  {/* 25% thickness */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
        ${borderWidth !== 2 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderWidth(2)}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="0.425"
                        width="35"
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

                  {/* 50% thickness */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
        ${borderWidth !== 3 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderWidth(3)}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="0.85"
                        width="35"
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

                  {/* 75% thickness */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125
        ${borderWidth !== 4 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderWidth(4)}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="1.292"
                        width="35"
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

                  {/* 100% thickness */}
                  <button
                     className={`border rounded-md transition duration-500 hover:scale-125 
        ${borderWidth !== 5 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                     onClick={() => setBorderWidth(5)}
                  >
                     <svg
                        viewBox="0 0 17 17"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                        stroke="#000000"
                        stroke-width="1.7"
                        width="35"
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
               </div>
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

// if only one node is selected, show the node settings
function NodeSettings({ node, graph }: { node: X6Type.Node; graph: MutableRefObject<X6Type.Graph> }) {
   // for the name of the node
   const [nodeName, setNodeName] = useState("");
   // for the height of a cell
   const [height, setHeight] = useState(node.getProp("size")?.height || node.getProp("height"));
   // for the width of a cell
   const [width, setWidth] = useState(node.getProp("size")?.width || node.getProp("width"));
   // for the x position of a cell
   const [x, setX] = useState(node.getProp("position")?.x || node.getProp("x"));
   // for the y position of a cell
   const [y, setY] = useState(node.getProp("position")?.y || node.getProp("y"));
   // for the variables of a class node
   const [variables, setVariables] = useState((node.getProp("variables") as ClassNode["variables"]) || []);
   // for the methods of a class node
   const [methods, setMethods] = useState((node.getProp("methods") as ClassNode["methods"]) || []);

   // if selected cell position or size is currently locked or not
   const [positionLocked, setPositionLocked] = useState(false); // pos initially not locked
   const [sizeLocked, setSizeLocked] = useState(false); // size initially not locked

   // setting the node name
   useEffect(() => {
      if (!node) {
         return;
      }

      const props = node.prop();
      console.log("props", props);
      setNodeName(props.name);
      setHeight(props.size?.height || props.height);
      setWidth(props.size?.width || props.width);

      node.on("change:size", (args) => {
         const size = args.cell.getProp("size");
         setWidth(size.width);
         setHeight(size.height);
      });

      node.on("change:position", (cell) => {
         setX(cell.current.x);
         setY(cell.current.y);
      });
   }, [node]);

   return (
      <>
         <div className="flex flex-col pb-3">
            {/* ---------------------- NODE NAME SECTION ---------------------- */}
            <div className="flex justify-between">
               <div className="font-bold mb-1.5">Node Settings</div>
            </div>
            <div className="flex items-center gap-2">
               <div className="items-center gap-2">
                  <div className="flex items-center mb-1.5">
                     <div className="w-1/4">Name</div>
                     <input
                        value={nodeName}
                        className="w-full ml-1 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-1 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                        type="text"
                        onChange={(e) => {
                           console.log(node.prop());

                           // set the name of the node
                           setNodeName(e.target.value);

                           // set the name of the node in the graph
                           node.trigger("change:className", { name: e.target.value });
                        }}
                        // if the input is "Untitled" highlight the entire text
                        onFocus={(e) => {
                           if (e.target.value === "Untitled") {
                              e.target.select();
                           }
                        }}
                        // if the input is empty after clicking out of the input field, set the name to "Untitled"
                        onBlur={(e) => {
                           if (e.target.value === "") {
                              setNodeName("Untitled");
                              node.prop("name", "Untitled");
                           }
                        }}
                     />

                     {/* delete button to delete the node */}
                     <div className="flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                        <div
                           className="p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                           onClick={() => {
                              // remove the node from the graph
                              graph.current.removeCell(node);
                           }}
                        >
                           <span
                              role="button"
                              className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                           >
                              {/* trash can svg */}
                              <svg
                                 width="20px"
                                 height="20px"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 xmlns="http://www.w3.org/2000/svg"
                              >
                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                 <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                 <g id="SVGRepo_iconCarrier">
                                    <path
                                       d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                       stroke="#000000"
                                       stroke-width="1.5"
                                       stroke-linecap="round"
                                       stroke-linejoin="round"
                                    ></path>
                                 </g>
                              </svg>
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* ---------------------- NODE VARIABLES SECTION ---------------------- */}
                  <div className="flex flex-col">
                     <div className="flex justify-between mb-1">
                        <div className="font-bold">Variables</div>

                        {/* add button to add a new variable to the selected node */}
                        <div className="pr-2 flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                           <div
                              className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center"
                              onClick={() => {
                                 // get the selected cell and its variables
                                 const variablesTemp = [...variables];

                                 // add this new variable to the array of variables
                                 variablesTemp.push({
                                    type: "String",
                                    name: `variable${variablesTemp.length + 1}`,
                                    value: "value",
                                    // @ts-ignore
                                    accessModifier: "private",
                                 });

                                 setVariables(variablesTemp);
                                 node.trigger("change:variables", { variables: variablesTemp });

                                 const newHeight = height + (variablesTemp.length > 1 ? 20 : 36);
                                 node.resize(node.prop("size").width, newHeight);
                              }}
                           >
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
                                    />
                                 </svg>
                              </span>
                           </div>
                        </div>
                     </div>

                     {/* map out all the variables in the selected cell */}
                     <div className="relative mb-1">
                        <ScrollFade maxHeight={90}>
                           {variables.map((variable, index) => (
                              <NodeSettingsVariable
                                 key={index}
                                 node={node}
                                 variables={variables}
                                 variable={variable}
                                 index={index}
                                 setVariables={setVariables}
                              />
                           ))}
                        </ScrollFade>
                     </div>
                  </div>

                  {/* ---------------------- NODE METHODS SECTION ---------------------- */}
                  <div className="flex flex-col">
                     <div className="flex justify-between mb-1">
                        <div className="font-bold">Methods</div>

                        {/* add button to add a new method to the selected node */}
                        <div className="pr-2 flex items-center justify-center w-5 h-5 ml-2 rounded-md hover:cursor-pointer">
                           <div
                              className="p-2 transform hover:bg-slate-300 transition duration-500 hover:scale-125 flex justify-center items-center"
                              onClick={() => {
                                 // get the selected cell and its variables
                                 const methodsTemp = [...methods];

                                 // add this new variable to the array of variables
                                 methodsTemp.push({
                                    type: "String",
                                    name: `method${methodsTemp.length + 1}`,
                                    parameters: [],

                                    // @ts-ignore
                                    accessModifier: "public",
                                 });

                                 setMethods(methodsTemp);
                                 node.trigger("change:methods", { methods: methodsTemp });

                                 const newHeight = height + (methodsTemp.length > 1 ? 20 : 36);
                                 node.resize(node.prop("size").width, newHeight);
                              }}
                           >
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
                                    />
                                 </svg>
                              </span>
                           </div>
                        </div>
                     </div>
                     {/* map out all the variables in the selected cell */}
                     <div className="relative mb-1">
                        <ScrollFade maxHeight={90}>
                           {methods.map((method, index) => (
                              <NodeSettingsMethod
                                 key={index}
                                 node={node}
                                 methods={methods}
                                 method={method}
                                 index={index}
                                 setMethods={setMethods}
                              />
                           ))}
                        </ScrollFade>
                     </div>
                  </div>

                  <div className="flex justify-between">
                     {/* ---------------------- NODE POSITION SECTION ---------------------- */}
                     <div className="flex flex-col pt-1.5">
                        <div className="flex justify-between">
                           <div className="font-bold mb-1.5">Position</div>
                        </div>

                        <div className="items-center gap-3">
                           {/* x location input */}
                           <div className="flex items-center mb-1">
                              <div className="w-1/7">X</div>
                              <input
                                 value={x}
                                 className={`w-16 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    positionLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 autoCapitalize="none"
                                 autoComplete="both"
                                 autoCorrect="off"
                                 spellCheck="false"
                                 disabled={positionLocked}
                              />
                           </div>

                           {/* y location input */}
                           <div className="flex items-center">
                              <div className="w-1/7">Y</div>
                              <input
                                 value={y}
                                 className={`w-16 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    positionLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 autoCapitalize="none"
                                 autoComplete="both"
                                 autoCorrect="off"
                                 spellCheck="false"
                                 disabled={positionLocked}
                              />
                           </div>
                        </div>
                        <div className="flex mt-1.5">
                           <input
                              type="checkbox"
                              id="position-lock"
                              className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                              onChange={() => setPositionLocked(!positionLocked)}
                              checked={positionLocked}
                           />
                           <label htmlFor="position-lock">Lock pos</label>
                        </div>
                     </div>

                     {/* ---------------------- NODE SIZING SECTION ---------------------- */}
                     <div className="flex flex-col pt-1.5">
                        <div className="font-bold mb-1.5 justify-between">Sizing</div>
                        <div className="items-center gap-3">
                           {/* width input */}
                           <div className="flex items-center mb-1">
                              <div className="w-12">Width</div>
                              <input
                                 value={width}
                                 className={`w-16 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    sizeLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400"
                                 }`}
                                 type="text"
                                 disabled={sizeLocked}
                              />
                           </div>

                           {/* height input */}
                           <div className="flex items-center">
                              <div className="w-12">Height</div>
                              <input
                                 value={height}
                                 className={`w-16 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
                                    sizeLocked
                                       ? "hover:cursor-not-allowed text-slate-500"
                                       : "hover:border-slate-400 focus:border-slate-400 text-black"
                                 }`}
                                 type="text"
                                 disabled={sizeLocked}
                              />
                           </div>

                           <div className="flex mt-1.5">
                              <input
                                 type="checkbox"
                                 id="size-lock"
                                 className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                                 onChange={() => setSizeLocked(!sizeLocked)}
                                 checked={sizeLocked}
                              />
                              <label htmlFor="size-lock">Lock size</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <hr className="border-slate-400 pb-1.5" />
      </>
   );
}

function NodeSettingsVariable({
   node,
   variables,
   variable,
   index,
   setVariables,
}: {
   node: X6Type.Node;
   variables: ClassNode["variables"];
   variable: ClassNode["variables"][0];
   index: number;
   setVariables: React.Dispatch<React.SetStateAction<ClassNode["variables"]>>;
}) {
   const [accessModifier, setAccessModifier] = useState(variable.accessModifier);
   const [name, setName] = useState(variable.name);
   const [type, setType] = useState(variable.type);
   const [value, setValue] = useState(variable.value);

   useEffect(() => {
      // update the node's variables array
      const newVariables = [...variables];
      newVariables[index] = {
         ...variable,
         accessModifier,
         name,
         type,
         value,
      };
      setVariables(newVariables);
   }, [accessModifier, name, type, value]);

   return (
      <div>
         {/* list all of the different variables on different lines */}
         <div className="flex gap-2">
            <div className="flex mb-0.5">
               {/* access modifier dropdown input */}
               <div className="w-6 mr-1">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-1 select-none">
                        {accessModifier === "private"
                           ? "-"
                           : accessModifier === "public"
                           ? "+"
                           : accessModifier === "protected"
                           ? "#"
                           : "-"}
                     </div>
                     <select
                        value={accessModifier}
                        className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400 pl-6"
                        onChange={(e) => {
                           // update the node's variables array
                           // @ts-ignore
                           variables[index].accessModifier = e.target.value;
                           node.trigger("change:variables", { variables });
                           setAccessModifier(variables[index].accessModifier);
                        }}
                     >
                        <option value="private">private (-)</option>
                        <option value="public">public (+)</option>
                        <option value="protected">protected (#)</option>
                     </select>
                  </div>
               </div>
               {/* variable type text input */}
               <div className="w-12 mr-1">
                  <input
                     value={type}
                     className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     type="text"
                     onChange={(e) => {
                        // update the node's variables array
                        setType(e.target.value);
                        variables[index].type = e.target.value;
                        console.log(variables[index].type);
                        node.trigger("change:variables", { variables });
                     }}
                     // if the input is "Untitled" highlight the entire text
                     onFocus={(e) => {
                        if (e.target.value === "Untitled") {
                           e.target.select();
                        }
                     }}
                     // if the input is empty after clicking out of the input field, set the name to "Untitled"
                     onBlur={(e) => {}}
                  />
               </div>
               {/* variable name input */}
               <input
                  value={name}
                  className="w-16 text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setName(e.target.value);
                     variables[index].name = e.target.value;
                     node.trigger("change:variables", { variables });
                  }}
                  // if the input is "Untitled" highlight the entire text
                  onFocus={(e) => {
                     if (e.target.value === "Untitled") {
                        e.target.select();
                     }
                  }}
                  // if the input is empty after clicking out of the input field, set the name to "Untitled"
                  onBlur={(e) => {}}
               />
               {/* variable value input */}
               <div className={`ml-0.5 mr-0.5 ${!value ? "text-slate-400" : "text-black"}`}>=</div>
               <input
                  value={value}
                  className={`w-10 text-center block rounded-md border text-md focus:outline-none hover:border-slate-400 focus:border-slate-400
                     ${
                        !value
                           ? "border-2 border-dotted bg-slate-100 border-slate-400 h-6.5"
                           : "bg-slate-200 border-slate-300 py-3 h-3"
                     }`}
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setValue(e.target.value);
                     variables[index].value = e.target.value;
                     node.trigger("change:variables", { variables });
                  }}
                  // if the input is "Untitled" highlight the entire text
                  onFocus={(e) => {
                     if (e.target.value === "Untitled") {
                        e.target.select();
                     }
                  }}
                  // if the input is empty after clicking out of the input field, set the name to "Untitled"
                  onBlur={(e) => {}}
               />
               {/* delete button to delete the variable */}
               <div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-md hover:cursor-pointer">
                  <div
                     className="mt-1 p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        // update the node's variables array
                        const newVariables = [...variables];
                        newVariables.splice(index, 1);
                        setVariables(newVariables);
                        node.trigger("change:variables", { variables: newVariables });

                        const currentWidth = node.prop("size").width;
                        const currentHeight = node.prop("size").height;

                        // update the node's size
                        const newHeight = currentHeight - (newVariables.length === 0 ? 36 : 20);
                        node.resize(currentWidth, newHeight);
                     }}
                  >
                     <span
                        role="button"
                        className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                     >
                        {/* trash can svg */}
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <path
                                 d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                 stroke="#000000"
                                 stroke-width="1.5"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              ></path>
                           </g>
                        </svg>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function NodeSettingsMethod({
   node,
   methods,
   method,
   index,
   setMethods,
}: {
   node: X6Type.Node;
   methods: ClassNode["methods"];
   method: ClassNode["methods"][0];
   index: number;
   setMethods: React.Dispatch<React.SetStateAction<ClassNode["methods"]>>;
}) {
   const [accessModifier, setAccessModifier] = useState(method.accessModifier);
   const [name, setName] = useState(method.name);
   const [type, setType] = useState(method.type);
   const [parameters, setParameters] = useState(method.parameters);

   useEffect(() => {
      // update the node's methods array
      const newMethods = [...methods];
      newMethods[index] = {
         ...method,
         accessModifier,
         name,
         type,
         parameters,
      };
      setMethods(newMethods);
   }, [accessModifier, name, type, parameters]);

   return (
      <div>
         {/* list all of the different methods on different lines */}
         <div className="flex gap-2">
            <div className="flex mb-0.5">
               {/* access modifier dropdown input */}
               <div className="w-6 mr-1">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-1 select-none">
                        {accessModifier === "private"
                           ? "-"
                           : accessModifier === "public"
                           ? "+"
                           : accessModifier === "protected"
                           ? "#"
                           : "-"}
                     </div>
                     <select
                        value={accessModifier}
                        className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400 pl-6"
                        onChange={(e) => {
                           // update the node's method array
                           // @ts-ignore
                           methods[index].accessModifier = e.target.value;
                           node.trigger("change:methods", { methods });
                           setAccessModifier(methods[index].accessModifier);
                        }}
                     >
                        <option value="private">private (-)</option>
                        <option value="public">public (+)</option>
                        <option value="protected">protected (#)</option>
                     </select>
                  </div>
               </div>
               {/* method type text input */}
               <div className="w-12 mr-1">
                  <input
                     value={type}
                     className="w-full text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                     type="text"
                     onChange={(e) => {
                        // update the node's methods array
                        setType(e.target.value);
                        methods[index].type = e.target.value;
                        console.log(methods[index].type);
                        node.trigger("change:methods", { methods });
                     }}
                     // if the input is "Untitled" highlight the entire text
                     onFocus={(e) => {
                        if (e.target.value === "Untitled") {
                           e.target.select();
                        }
                     }}
                     // if the input is empty after clicking out of the input field, set the name to "Untitled"
                     onBlur={(e) => {}}
                  />
               </div>
               {/* method name input */}
               <input
                  value={name}
                  className="w-16 text-center block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 text-md focus:outline-none hover:border-slate-400 focus:border-slate-400"
                  type="text"
                  onChange={(e) => {
                     // update the node's variables array
                     setName(e.target.value);
                     methods[index].name = e.target.value;
                     node.trigger("change:methods", { methods });
                  }}
                  // if the input is "Untitled" highlight the entire text
                  onFocus={(e) => {
                     if (e.target.value === "Untitled") {
                        e.target.select();
                     }
                  }}
                  // if the input is empty after clicking out of the input field, set the name to "Untitled"
                  onBlur={(e) => {}}
               />
               {/* method parameters dropdown */}

               {/* delete button to delete the variable */}
               <div className="flex items-center justify-center w-5 h-5 ml-0.5 rounded-md hover:cursor-pointer">
                  <div
                     className="mt-1 p-2 transform transition duration-500 hover:scale-125 flex justify-center items-center"
                     onClick={() => {
                        // update the node's variables array
                        const newMethods = [...methods];
                        newMethods.splice(index, 1);
                        setMethods(newMethods);
                        node.trigger("change:methods", { methods: newMethods });

                        const currentWidth = node.prop("size").width;
                        const currentHeight = node.prop("size").height;

                        // update the node's size
                        const newHeight = currentHeight - (newMethods.length === 0 ? 36 : 20);
                        node.resize(currentWidth, newHeight);
                     }}
                  >
                     <span
                        role="button"
                        className="svg-container raw_components--iconButtonEnabled--dC-EG raw_components--_iconButton--aCldD pages_panel--newPageButton--shdlr"
                     >
                        {/* trash can svg */}
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g id="SVGRepo_iconCarrier">
                              <path
                                 d="M10 10V16M14 10V16M18 6V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V6M4 6H20M15 6V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V6"
                                 stroke="#000000"
                                 stroke-width="1.5"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              ></path>
                           </g>
                        </svg>
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
