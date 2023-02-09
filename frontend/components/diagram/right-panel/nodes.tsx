"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, useState } from "react";
import { backgroundColorOptions, borderColorOptions } from ".";

export default function NodesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   // for current background & border colors of selected cell
   const [backgroundColor, setBackgroundColor] = useState("FFFFFF"); // <- default should be initial bg color
   const [borderColor, setBorderColor] = useState("000000"); // <- default should be initial border color

   // for current line width & style of selected cell
   const [borderWidth, setBorderWidth] = useState(1); // <- default should be initial border width
   const [borderStyle, setBorderStyle] = useState("solid"); // <- default should be initial border style

   // if selected cell currently has a shadow or not
   const [shadow, setShadow] = useState(false); // initially no shadow

   // font options
   const fontOptions = ["Sans-Serif", "Times New Roman", "Tahoma", "Comic Sans MS", "Courier New", "Georgia"];

   // if the font options will be shown from the dropdown menu
   const [showFontOptions, setShowFontOptions] = useState(false);
   const [font, setFont] = useState("Sans-Serif"); // <- default should be initial font

   // all the text styles of the selected cell
   const [textBold, setTextBold] = useState(false);
   const [textItalic, setTextItalic] = useState(false);
   const [textUnderline, setTextUnderline] = useState(false);
   const [textOverline, setTextOverline] = useState(false);
   const [textStrikethrough, setTextStrikethrough] = useState(false);

   // text justification of the selected cell
   const [textJustify, setTextJustify] = useState("center");

   // if selected cell position or size is currently locked or not
   const [positionLocked, setPositionLocked] = useState(false); // pos initially not locked
   const [sizeLocked, setSizeLocked] = useState(false); // size initially not locked
   // -----------------------------------------------------------------------------

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
                  {backgroundColorOptions.map((color) => {
                     return color === backgroundColor ? (
                        // if the current bg color is set to this color, put a checkmark svg on it
                        <button
                           style={{ color: `#${color}` }}
                           className={
                              "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                           }
                        >
                           {/* checkmark svg source: https://www.svgrepo.com/svg/452247/checkmark */}
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
                              setBackgroundColor(color);
                           }}
                        />
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
                  {borderColorOptions.map((color) => {
                     // if the current collor
                     return color === borderColor ? (
                        <button
                           style={{ color: `#${color}` }}
                           className={
                              "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                           }
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="white">
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
                              setBorderColor(color);
                           }}
                        />
                     );
                  })}
               </div>
            </div>

            {/* the current color hex code of the cell */}
            <div className="mt-1  w-full flex">
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
         <div className="flex flex-col pt-3 pb-3">
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
            <div className="flex mt-2 ml-16">
               <input
                  type="checkbox"
                  className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                  onChange={() => setShadow(!shadow)}
                  checked={shadow}
               />
               <label>Shadow</label>
            </div>
         </div>
         <hr className="border-slate-400" />

         {/* ---------------------- TEXT STYLING SECTION ---------------------- */}
         <div className="flex flex-col pt-3 pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-2">Text Styling</div>
            </div>

            {/* section for the font type */}
            <div className="flex items-center">
               <div className="w-full flex">
                  <label className="mt-1 mr-2">Font</label>

                  <div>
                     <button
                        className="justify-between text-sm bg-transparent inline-flex bg-slate-200 border border-slate-300 rounded-md w-44 hover:border-slate-400 p-1 pl-2 pr-2"
                        onClick={() => setShowFontOptions(!showFontOptions)}
                     >
                        <p className="truncate">{font}</p>

                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           className="w-4 h-4"
                           fill="none"
                           viewBox="0 0 20 20"
                           stroke="currentColor"
                           strokeWidth={2}
                        >
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                     </button>
                     {showFontOptions && (
                        <div className="absolute w-56 right-2 z-10 mt-1 origin-top-right bg-slate-100 border border-slate-400 rounded-md shadow-xl">
                           <div className="p-1">
                              {fontOptions.map((font) => {
                                 return font === font ? (
                                    <button
                                       className={"flex pl-1 w-full text-justify py-2 text-sm rounded-lg hover:bg-slate-300"}
                                       onClick={() => {
                                          setShowFontOptions(!showFontOptions);
                                       }}
                                    >
                                       <div className="mr-3">{font}</div>

                                       {/* checkmark svg source: https://www.svgrepo.com/svg/452247/checkmark */}
                                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 25">
                                          <path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
                                       </svg>
                                    </button>
                                 ) : (
                                    <button
                                       className={
                                          "block pl-1 w-full text-justify py-2 text-sm rounded-lg hover:bg-slate-300"
                                       }
                                       onClick={() => {
                                          setFont(font);
                                          setShowFontOptions(!showFontOptions);
                                       }}
                                    >
                                       {font}
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* section for the font style */}
            <div className="flex items-center mt-2 mb-2 gap-1">
               <label className="mr-1">Style</label>

               {/* bold svg source: https://www.svgrepo.com/svg/375961/bold */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${!textBold ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextBold(!textBold)}
               >
                  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="30" height="20">
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path
                           fill="#000000"
                           d="M4,2 L7.96296,2 C8.59259,2 9.17901,2.04923 9.72222,2.14769 C10.2778,2.23385 10.7593,2.38769 11.1667,2.60923 C11.5741,2.83077 11.8951,3.13846 12.1296,3.53231 C12.3642,3.91385 12.4815,4.4 12.4815,4.99077 C12.4815,5.24923 12.4383,5.51385 12.3519,5.78462 C12.2778,6.04308 12.1543,6.29538 11.9815,6.54154 C11.821,6.77538 11.6111,6.98461 11.3519,7.16923 C11.0926,7.35385 10.7901,7.48923 10.4444,7.57538 L10.4444,7.64923 C11.2963,7.82154 11.9321,8.13538 12.3519,8.59077 C12.784,9.03385 13,9.65539 13,10.4554 C13,11.0708 12.8765,11.6062 12.6296,12.0615 C12.3951,12.5046 12.0617,12.8738 11.6296,13.1692 C11.2099,13.4523 10.716,13.6615 10.1481,13.7969 C9.58025,13.9323 8.97531,14 8.33333,14 L4,14 L4,2 Z M7.88889,6.72615 C8.40741,6.72615 8.78395,6.60923 9.01852,6.37538 C9.25309,6.14154 9.37037,5.84 9.37037,5.47077 C9.37037,5.10154 9.25309,4.83692 9.01852,4.67692 C8.78395,4.51692 8.40741,4.43692 7.88889,4.43692 L7,4.43692 L7,6.72615 L7.88889,6.72615 Z M8.11111,11.5631 C8.74074,11.5631 9.19136,11.4462 9.46296,11.2123 C9.74691,10.9785 9.88889,10.64 9.88889,10.1969 C9.88889,9.75385 9.74691,9.43385 9.46296,9.23692 C9.19136,9.04 8.74074,8.94154 8.11111,8.94154 L7,8.94154 L7,11.5631 L8.11111,11.5631 Z"
                        />
                     </g>
                  </svg>
               </button>

               {/* italic svg source: https://www.svgrepo.com/svg/379051/italic */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${!textItalic ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextItalic(!textItalic)}
               >
                  <svg
                     viewBox="0 0 16 16"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="#000000"
                     width="30"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <rect width="16" height="16" id="icon-bound" fill="none"></rect>{" "}
                        <path
                           id="italic"
                           d="M9.439,3l-5,10l-3.439,0l-0,2l9,0l0,-2l-3.439,0l5,-10l3.439,0l0,-2l-9,0l0,2l3.439,0Z"
                        />
                     </g>
                  </svg>
               </button>

               {/* underline svg source: xhttps://www.svgrepo.com/svg/378912/underline */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${!textUnderline ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextUnderline(!textUnderline)}
               >
                  <svg
                     viewBox="0 0 16 16"
                     version="1.1"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="#000000"
                     width="30"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <rect width="16" height="16" id="icon-bound" fill="none"></rect>
                        <path d="M3,13l10,0l0,2l-10,0l0,-2Zm8,-12l2,0l0,6c0,2.76 -2.24,5 -5,5c-2.76,0 -5,-2.24 -5,-5l0,-6l2,0l-0,6c-0,1.656 1.344,3 3,3c1.656,0 3,-1.344 3,-3l0,-6Z" />
                     </g>
                  </svg>
               </button>

               {/* overline svg source: https://www.svgrepo.com/svg/443896/gui-overline */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${!textOverline ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextOverline(!textOverline)}
               >
                  <svg
                     fill="#000000"
                     viewBox="0 0 14 14"
                     role="img"
                     focusable="false"
                     aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     stroke="#000000"
                     stroke-width="0.35"
                     width="30"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path d="m 1.6249445,1.0000002 10.7501115,0 0,1.26471 -10.7501115,0 0,-1.26471 z M 6.9501336,13 C 5.5316439,13 4.3958485,12.53344 3.5425585,11.60034 2.6892684,10.66695 2.2625604,9.4534699 2.2625604,7.9587402 c 0,-1.60653 0.4348966,-2.88791 1.3045428,-3.84434 0.8698141,-0.95625 2.0533131,-1.43438 3.5510009,-1.43438 1.3809693,0 2.4937737,0.46423 3.3382449,1.39302 0.844178,0.92863 1.266288,2.14255 1.266288,3.64147 0,1.6290897 -0.432608,2.9172498 -1.297782,3.8645598 C 9.559702,12.52637 8.4011886,13 6.9501336,13 Z m 0.082746,-9.3166298 c -1.0316117,0 -1.8695955,0.3828699 -2.5138672,1.1489399 -0.6442298,0.76588 -0.9664182,1.77217 -0.9664182,3.01897 0,1.2452797 0.3138739,2.2475299 0.9417685,3.0064899 0.6278737,0.75958 1.4471917,1.13905 2.457933,1.13905 1.0780765,0 1.9275033,-0.36219 2.5487421,-1.08625 0.6212602,-0.72405 0.9318792,-1.7374402 0.9318792,-3.0392099 0,-1.3348 -0.30199,-2.36641 -0.9050039,-3.09511 -0.6030351,-0.7287 -1.4348669,-1.09288 -2.4950335,-1.09288 z" />
                     </g>
                  </svg>
               </button>

               {/* strikethrough svg source: https://www.svgrepo.com/svg/332564/strikethrough */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${!textStrikethrough ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextStrikethrough(!textStrikethrough)}
               >
                  <svg
                     fill="#000000"
                     viewBox="0 0 1024 1024"
                     xmlns="http://www.w3.org/2000/svg"
                     className="icon"
                     stroke="#000000"
                     stroke-width="25.6"
                     width="30"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path d="M952 474H569.9c-10-2-20.5-4-31.6-6-15.9-2.9-22.2-4.1-30.8-5.8-51.3-10-82.2-20-106.8-34.2-35.1-20.5-52.2-48.3-52.2-85.1 0-37 15.2-67.7 44-89 28.4-21 68.8-32.1 116.8-32.1 54.8 0 97.1 14.4 125.8 42.8 14.6 14.4 25.3 32.1 31.8 52.6 1.3 4.1 2.8 10 4.3 17.8.9 4.8 5.2 8.2 9.9 8.2h72.8c5.6 0 10.1-4.6 10.1-10.1v-1c-.7-6.8-1.3-12.1-2-16-7.3-43.5-28-81.7-59.7-110.3-44.4-40.5-109.7-61.8-188.7-61.8-72.3 0-137.4 18.1-183.3 50.9-25.6 18.4-45.4 41.2-58.6 67.7-13.5 27.1-20.3 58.4-20.3 92.9 0 29.5 5.7 54.5 17.3 76.5 8.3 15.7 19.6 29.5 34.1 42H72c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h433.2c2.1.4 3.9.8 5.9 1.2 30.9 6.2 49.5 10.4 66.6 15.2 23 6.5 40.6 13.3 55.2 21.5 35.8 20.2 53.3 49.2 53.3 89 0 35.3-15.5 66.8-43.6 88.8-30.5 23.9-75.6 36.4-130.5 36.4-43.7 0-80.7-8.5-110.2-25-29.1-16.3-49.1-39.8-59.7-69.5-.8-2.2-1.7-5.2-2.7-9-1.2-4.4-5.3-7.5-9.7-7.5h-79.7c-5.6 0-10.1 4.6-10.1 10.1v1c.2 2.3.4 4.2.6 5.7 6.5 48.8 30.3 88.8 70.7 118.8 47.1 34.8 113.4 53.2 191.8 53.2 84.2 0 154.8-19.8 204.2-57.3 25-18.9 44.2-42.2 57.1-69 13-27.1 19.7-57.9 19.7-91.5 0-31.8-5.8-58.4-17.8-81.4-5.8-11.2-13.1-21.5-21.8-30.8H952c4.4 0 8-3.6 8-8v-60a8 8 0 0 0-8-7.9z" />
                     </g>
                  </svg>
               </button>
            </div>

            {/* section for the text justification */}
            <div className="flex items-center gap-1.5">
               <label className="mr-1">Justify</label>

               {/* left justify svg source: https://www.svgrepo.com/svg/349047/justify-left */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${textJustify !== "left" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextJustify("left")}
               >
                  <svg
                     fill="#000000"
                     viewBox="0 0 8 8"
                     xmlns="http://www.w3.org/2000/svg"
                     transform="matrix(1, 0, 0, 1, 0, 0)"
                     width="45"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path d="M0 0v1h8v-1h-8zm0 2v1h8v-1h-8zm0 2v1h8v-1h-8zm0 2v1h6v-1h-6z" />
                     </g>
                  </svg>
               </button>

               {/* center justify svg source: https://www.svgrepo.com/svg/349046/justify-center */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${textJustify !== "center" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextJustify("center")}
               >
                  <svg fill="#000000" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" width="45" height="20">
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path d="M0 0v1h8v-1h-8zm0 2v1h8v-1h-8zm0 2v1h8v-1h-8zm1 2v1h6v-1h-6z" />
                     </g>
                  </svg>
               </button>

               {/* right justify svg source: https://www.svgrepo.com/svg/349047/justify-left */}
               <button
                  className={`border rounded-md transition duration-500 hover:scale-125 py-1
        ${textJustify !== "right" ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
                  onClick={() => setTextJustify("right")}
               >
                  <svg
                     fill="#000000"
                     viewBox="0 0 8 8"
                     xmlns="http://www.w3.org/2000/svg"
                     transform="matrix(-1, 0, 0, 1, 0, 0)"
                     width="45"
                     height="20"
                  >
                     <g id="SVGRepo_bgCarrier" stroke-width="0" />
                     <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                     <g id="SVGRepo_iconCarrier">
                        <path d="M0 0v1h8v-1h-8zm0 2v1h8v-1h-8zm0 2v1h8v-1h-8zm0 2v1h6v-1h-6z" />
                     </g>
                  </svg>
               </button>
            </div>
         </div>
         <hr className="border-slate-400" />

         {/* ---------------------- POSITION SECTION ---------------------- */}

         <div className="flex flex-col pt-3 pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-1.5">Position</div>
            </div>

            <div className="items-center gap-3">
               {/* x location input */}
               <div className="flex mb-1">
                  <div className="w-1/7">X</div>
                  <input
                     value="20"
                     className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center ${
                        positionLocked ? "hover:cursor-not-allowed" : "hover:border-slate-400 focus:border-slate-400"
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
               <div className="flex">
                  <div className="w-1/7">Y</div>
                  <input
                     value="10"
                     className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center ${
                        positionLocked ? "hover:cursor-not-allowed" : "hover:border-slate-400 focus:border-slate-400"
                     }`}
                     type="text"
                     autoCapitalize="none"
                     autoComplete="both"
                     autoCorrect="off"
                     spellCheck="false"
                     disabled={positionLocked}
                  />
               </div>
               <div className="flex mt-1.5">
                  <input
                     type="checkbox"
                     className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                     onChange={() => setPositionLocked(!positionLocked)}
                     checked={positionLocked}
                  />
                  <label>Lock position</label>
               </div>
            </div>
         </div>
         <hr className="border-slate-400" />

         {/* ---------------------- SIZING SECTION ---------------------- */}
         <div className="flex flex-col pt-3 pb-3">
            <div className="flex justify-between">
               <div className="font-bold mb-1.5">Sizing</div>
            </div>

            <div className="items-center gap-3">
               {/* width input */}
               <div className="flex mb-1">
                  <div className="w-1/4">Width</div>
                  <input
                     value="20"
                     className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center focus:outline-none ${
                        sizeLocked ? "hover:cursor-not-allowed" : "hover:border-slate-400 focus:border-slate-400"
                     }`}
                     type="text"
                     autoCapitalize="none"
                     autoComplete="both"
                     autoCorrect="off"
                     spellCheck="false"
                     disabled={sizeLocked}
                  />
               </div>

               {/* height input */}
               <div className="flex">
                  <div className="w-1/4">Height</div>
                  <input
                     value="10"
                     className={`w-1/3 block h-3 rounded-md border bg-slate-200 border-slate-300 py-3 px-3 text-md placeholder:text-black placeholder:text-center ${
                        sizeLocked ? "hover:cursor-not-allowed" : "hover:border-slate-400 focus:border-slate-400"
                     }`}
                     type="text"
                     autoCapitalize="none"
                     autoComplete="both"
                     autoCorrect="off"
                     spellCheck="false"
                     disabled={sizeLocked}
                  />
               </div>

               <div className="flex mt-1.5">
                  <input
                     type="checkbox"
                     className="mr-2 w-5 h-5 border-slate-300 hover:ring-0 transition duration-500 hover:scale-125 accent-black"
                     onChange={() => setSizeLocked(!sizeLocked)}
                     checked={sizeLocked}
                  />
                  <label>Lock size</label>
               </div>
            </div>
         </div>
      </>
   );
}
