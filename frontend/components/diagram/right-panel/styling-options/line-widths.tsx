import { cn } from "@/lib/utils";

export default function LineWidth({
   lineWidth,
   setLineWidth,
}: {
   lineWidth: number;
   setLineWidth: React.Dispatch<React.SetStateAction<number>>;
}) {
   // list with line width options and their icons
   const lineWidthOptions = [
      {
         // 0% thickness
         width: 1,
         icon: (
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
         ),
      },
      {
         // 25% thickness
         width: 2,
         icon: (
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
         ),
      },
      {
         // 50% thickness
         width: 3,
         icon: (
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
         ),
      },
      {
         // 75% thickness
         width: 4,
         icon: (
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
         ),
      },
      {
         // 100% thickness
         width: 5,
         icon: (
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
         ),
      },
   ];

   return (
      <div className="flex items-center gap-1.5 pl-2">
         {/* map out all of the width options */}
         {lineWidthOptions.map((option) => (
            <button
               key={option.width}
               className={cn(
                  "border rounded-md transition duration-500 hover:scale-[1.2]",
                  lineWidth !== option.width ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400",
               )}
               onClick={() => setLineWidth(option.width)}
            >
               {option.icon}
            </button>
         ))}
      </div>
   );
}
