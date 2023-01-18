import type X6Type from "@antv/x6";

export function ZoomButton({ graph, zoom }: { graph: X6Type.Graph; zoom: number }) {
   return (
      <div
         className="w-16 h-full px-2 text-xs flex items-center gap-1 cursor-pointer"
         onClick={() => {
            graph?.zoom(0.5, { absolute: true });
         }}
      >
         <div>{zoom * 100}%</div>
         <svg className="svg" width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
            <path
               d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
               fillRule="evenodd"
               fillOpacity="1"
               fill="#000"
               stroke="none"
               className="fill-white"
            ></path>
         </svg>
      </div>
   );
}
