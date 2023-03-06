export default function LineWidth({
   lineWidth,
   setLineWidth,
}: {
   lineWidth: number;
   setLineWidth: React.Dispatch<React.SetStateAction<number>>;
}) {
   return (
      <div className="flex items-center gap-1.5 pl-2">
         {/* 0% thickness */}
         <button
            className={`border rounded-md transition duration-500 hover:scale-125 
            ${lineWidth !== 1 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
            onClick={() => {
               setLineWidth(1);

               // change the border width of the selected cell(s)
            }}
         >
            <svg
               viewBox="0 0 17 17"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               stroke="#000000"
               strokeWidth="0.00017"
               width="35"
               height="25"
            >
               <g strokeWidth="0" />
               <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
               <g>
                  <path d="M17 8v1h-17v-1h17z" fill="#000000" />
               </g>
            </svg>
         </button>

         {/* 25% thickness */}
         <button
            className={`border rounded-md transition duration-500 hover:scale-125
            ${lineWidth !== 2 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
            onClick={() => setLineWidth(2)}
         >
            <svg
               viewBox="0 0 17 17"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               stroke="#000000"
               strokeWidth="0.425"
               width="35"
               height="25"
            >
               <g strokeWidth="0" />
               <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
               <g>
                  <path d="M17 8v1h-17v-1h17z" fill="#000000" />
               </g>
            </svg>
         </button>

         {/* 50% thickness */}
         <button
            className={`border rounded-md transition duration-500 hover:scale-125
            ${lineWidth !== 3 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
            onClick={() => setLineWidth(3)}
         >
            <svg
               viewBox="0 0 17 17"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               stroke="#000000"
               strokeWidth="0.85"
               width="35"
               height="25"
            >
               <g strokeWidth="0" />
               <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
               <g>
                  <path d="M17 8v1h-17v-1h17z" fill="#000000" />
               </g>
            </svg>
         </button>

         {/* 75% thickness */}
         <button
            className={`border rounded-md transition duration-500 hover:scale-125
            ${lineWidth !== 4 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
            onClick={() => setLineWidth(4)}
         >
            <svg
               viewBox="0 0 17 17"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               stroke="#000000"
               strokeWidth="1.292"
               width="35"
               height="25"
            >
               <g strokeWidth="0" />
               <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
               <g>
                  <path d="M17 8v1h-17v-1h17z" fill="#000000" />
               </g>
            </svg>
         </button>

         {/* 100% thickness */}
         <button
            className={`border rounded-md transition duration-500 hover:scale-125 
            ${lineWidth !== 5 ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400"}`}
            onClick={() => setLineWidth(5)}
         >
            <svg
               viewBox="0 0 17 17"
               version="1.1"
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               stroke="#000000"
               strokeWidth="1.7"
               width="35"
               height="25"
            >
               <g strokeWidth="0" />
               <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
               <g>
                  <path d="M17 8v1h-17v-1h17z" fill="#000000" />
               </g>
            </svg>
         </button>
      </div>
   );
}
