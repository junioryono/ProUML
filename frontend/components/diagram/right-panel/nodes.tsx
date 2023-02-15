import type X6Type from "@antv/x6";
import { MutableRefObject, useEffect, useState } from "react";
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

   // if selected cell position or size is currently locked or not
   const [positionLocked, setPositionLocked] = useState(false); // pos initially not locked
   const [sizeLocked, setSizeLocked] = useState(false); // size initially not locked

   // for the height of a cell
   const [height, setHeight] = useState(0);
   // for the width of a cell
   const [width, setWidth] = useState(0);

   // -----------------------------------------------------------------------------

   // if there are multiple cells selected
   const [multipleCellsSelected, setMultipleCellsSelected] = useState(false);

   // if the selected cell is a group, set multipleCellsSelected to true
   useEffect(() => {
      if (graph.current?.getSelectedCells().length > 1) {
         setMultipleCellsSelected(true);
      } else {
         setMultipleCellsSelected(false);
      }
   }, [graph.current?.getSelectedCells()]);

   return (
      <>
         {/* ---------------------- BACKGROUND COLOR SECTION ---------------------- */}
         <div className="flex flex-col pb-3">
            <div className="flex justify-between">
               <div className="font-bold">Background Color</div>
            </div>

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

                                 // set the background color of the selected cell
                                 graph.current
                                    .getSelectedCells()
                                    .forEach((cell) => cell.setAttrs({ body: { fill: `#${color}` } }));
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
         <div className="flex flex-col pt-3 pb-3">
            <div className="flex justify-between">
               <div className="font-bold">Border Color</div>
            </div>
            <div className="flex w-56 items-center gap-2">
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

         <div className="flex flex-col pt-3 pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-1">Border Width</div>
            </div>
            <div className="flex items-center gap-1.5 pl-2">
               {/* 0% thickness */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 
        ${borderWidth !== 1 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setBorderWidth(1)}
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
         <div className="flex flex-col pt-3">
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

         {/* only show the size and position sections if multiple cells are selected */}
         {!multipleCellsSelected && (
            <>
               <hr className="border-slate-400" />

               {/* ---------------------- POSITION SECTION ---------------------- */}
               <div className="flex flex-col pt-3 pb-3">
                  <div className="flex justify-between">
                     <div className="font-bold mb-1.5">Position</div>
                  </div>

                  <div className="items-center gap-3">
                     {/* x location input */}
                     <div className="flex items-center mb-1">
                        <div className="w-1/7">X</div>
                        <input
                           value="20"
                           className={`w-1/3 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
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
                           value="10"
                           className={`w-1/3 h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
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
                     <label htmlFor="position-lock">Lock position</label>
                  </div>
               </div>
               <hr className="border-slate-400" />

               {/* ---------------------- SIZING SECTION ---------------------- */}
               <div className="flex flex-col pt-3 pb-3">
                  <div className="font-bold mb-1.5 justify-between">Sizing</div>
                  <div className="items-center gap-3">
                     {/* width input */}
                     <div className="flex items-center mb-1">
                        <div className="w-1/4">Width</div>
                        <input
                           value="20"
                           className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
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
                        <div className="w-1/4">Height</div>
                        <input
                           value="10"
                           className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md focus:outline-none ${
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
            </>
         )}
      </>
   );
}
