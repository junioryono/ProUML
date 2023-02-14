import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
import { lightColorOptions } from ".";

export default function GraphPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for the zoom of the graph
   const [zoom, setZoom] = useState(100);

   // for if a grid is visible or not
   const [grid, setGrid] = useState(true);

   // grid size
   const [gridSize, setGridSize] = useState(10);

   // for current background & border colors of selected cell
   const [background, setBackground] = useState(false);
   const [backgroundColor, setBackgroundColor] = useState("FFFFFF"); // <- default should be initial bg color

   // if the graph zoom changes, change the zoom to match
   useEffect(() => {
      graph.current?.on("scale", (args) => {
         // set the zoom of the slider without decimals
         setZoom(Math.round(args.sx * 100));
      });

      // set the zoom of the graph
      graph.current?.zoomTo(zoom / 100);
   }, [zoom]);

   return (
      <>
         {/* ---------------------- GRAPH SETTINGS SECTION ---------------------- */}
         <div className="flex flex-col pb-3">
            <div className="font-bold mb-1.5 justify-between">Graph Settings</div>

            {/* zoom slider */}
            <div className="flex-1 m-1 mb-3">
               <div className="mb-1.5 ml-2.5">Zoom</div>
               <div className="flex items-center">
                  <input
                     value={`${zoom}x`}
                     className="text-center w-16 h-5 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none"
                     type="text"
                     autoCapitalize="none"
                     autoComplete="both"
                     autoCorrect="off"
                     spellCheck="false"
                     disabled
                  />
                  <input
                     type="range"
                     min="0"
                     max="1000"
                     value={zoom}
                     className="ml-3 w-full bg-slate-300 rounded-full h-2 appearance-none focus:outline-none"
                     onChange={(e) => {
                        setZoom(parseInt(e.target.value));

                        // set the zoom of the graph
                        graph.current?.zoomTo(parseInt(e.target.value) / 100);
                     }}
                  />
               </div>
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

            <hr className="border-slate-400" />

            {/* grid toggle */}
            <div className="flex mb-3 mt-3">
               <input
                  type="checkbox"
                  className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                  onChange={() => {
                     setGrid(!grid);

                     // if the user wants to show the grid, set the grid size to 10
                     if (!grid) {
                        graph.current.setGridSize(gridSize);
                     }
                     // if the user wants to hide the grid, set the grid size to 0
                     else {
                        graph.current.setGridSize(0);
                     }
                  }}
                  checked={grid}
               />
               <label>Show grid</label>
            </div>

            {/* background color toggle */}
            <div className="flex mb-3">
               <input
                  type="checkbox"
                  className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                  onChange={() => setBackground(!background)}
                  checked={background}
               />
               <label>Background color</label>
            </div>

            {/* only show the background color options when the user wants a Background */}
            {background && (
               <>
                  {/* all of the background color options */}
                  <div className="flex w-56 items-center gap-2">
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

                                       // change the background color of the graph
                                       graph.current?.drawBackground({
                                          color: `#${color}`,
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
               </>
            )}
         </div>
      </>
   );
}
