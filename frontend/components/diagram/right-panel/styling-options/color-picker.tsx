export default function ColorPicker({
   colorOptions,
   objColor,
   setObjColor,
}: {
   colorOptions: string[];
   objColor: string;
   setObjColor: React.Dispatch<React.SetStateAction<string>>;
}) {
   return (
      <div>
         <div className="flex items-center gap-2">
            <div>
               {colorOptions.map((color) => {
                  return (
                     // if the current bg color is set to this color, put a checkmark svg on it
                     <button
                        key={color}
                        style={{ color: `#${color}` }}
                        className={
                           "m-1 border transition duration-500 hover:scale-125 border-black rounded-lg p-2 h-9 w-9 bg-current"
                        }
                        onClick={() => {
                           if (color !== objColor) {
                              setObjColor(color);

                              // change the background color of all selected cells
                           }
                        }}
                     >
                        {/* checkmark svg source: https://www.svgrepo.com/svg/452247/checkmark */}
                        {color === objColor && (
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
               style={{ color: objColor !== "Multiple" ? `#${objColor}` : "white" }}
               className={`ml-10 mr-1 border border-black rounded-md h-6.1 w-7 bg-current`}
            />
            <input
               value={objColor !== "Multiple" ? `#${objColor}` : ""}
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
   );
}
