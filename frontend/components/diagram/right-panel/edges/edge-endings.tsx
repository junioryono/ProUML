interface ArrowProps {
   direction: "left" | "right";
}

// svg source: https://www.svgrepo.com/svg/500330/arrow-right
export function OpenArrow({ direction }: ArrowProps) {
   return (
      <img
         src="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIycHgiIHZpZXdCb3g9IjAgMCAzMiAyMCIgdmVyc2lvbj0iMS4xIj48cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LDIpIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0gOCAwIEwgMCA4IEwgOCAxNiBNIDAgOCBMIDI0IDgiIHN0cm9rZT0iIzQwNDA0MCIgZmlsbD0idHJhbnNwYXJlbnQiLz48L3N2Zz4="
         className="geIcon geAdaptiveAsset"
         style={{
            width: "50%",
            height: "50%",
            // if the direction is right, rotate the arrow 180 degrees
            transform: direction === "right" ? "rotate(180deg)" : "",
         }}
      ></img>
   );
}

// svg source: https://www.svgrepo.com/svg/36997/triangular-arrow-facing-left
export function SolidArrow({ direction }: ArrowProps) {
   return (
      <img
         src="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIycHgiIHZpZXdCb3g9IjAgMCAzMiAyMCIgdmVyc2lvbj0iMS4xIj48cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LDIpIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0gMCA4IEwgOCAyIEwgOCAxNCBaIE0gOCA4IEwgMjQgOCIgc3Ryb2tlPSIjNDA0MDQwIiBmaWxsPSJ0cmFuc3BhcmVudCIvPjwvc3ZnPg=="
         className="geIcon geAdaptiveAsset"
         style={{
            width: "50%",
            height: "50%",
            // if the direction is right, rotate the arrow 180 degrees
            transform: direction === "right" ? "rotate(180deg)" : "",
         }}
      ></img>
   );
}

// svg source: https://www.svgrepo.com/svg/392323/diamond-figure-form-geometry-graphic-line
export function OpenDiamond({ direction }: ArrowProps) {
   return (
      <img
         src="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIycHgiIHZpZXdCb3g9IjAgMCAzMiAyMCIgdmVyc2lvbj0iMS4xIj48cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LDIpIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0gMCA4IEwgOCAzIEwgMTYgOCBMIDggMTMgWiBNIDE2IDggTCAyNCA4IiBzdHJva2U9IiM0MDQwNDAiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+"
         className="geIcon geAdaptiveAsset"
         style={{
            width: "50%",
            height: "50%",
            // if the direction is right, rotate the arrow 180 degrees
            transform: direction === "right" ? "rotate(180deg)" : "",
         }}
      ></img>
   );
}

// svg source: https://www.svgrepo.com/svg/403749/large-orange-diamond
export function SolidDiamond({ direction }: ArrowProps) {
   return (
      <img
         src="data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIycHgiIHZpZXdCb3g9IjAgMCAzMiAyMCIgdmVyc2lvbj0iMS4xIj48cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LDIpIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0gMCA4IEwgOCAzIEwgMTYgOCBMIDggMTMgWiBNIDAgOCBMIDI0IDgiIHN0cm9rZT0iIzQwNDA0MCIgZmlsbD0iIzQwNDA0MCIvPjwvc3ZnPg=="
         className="geIcon geAdaptiveAsset"
         style={{
            width: "50%",
            height: "50%",
            // if the direction is right, rotate the arrow 180 degrees
            transform: direction === "right" ? "rotate(180deg)" : "",
         }}
      ></img>
   );
}
