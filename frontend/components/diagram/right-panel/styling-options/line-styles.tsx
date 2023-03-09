// solid line svg source: https://www.svgrepo.com/svg/409180/layout-line-solid?edit=true
export function SolidLine() {
   return (
      <svg width="40" height="25" viewBox="0 0 17 17">
         <g strokeWidth="0" />
         <g strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.068" />
         <g>
            <path d="M17 8v1h-17v-1h17z" fill="#000000" />
         </g>
      </svg>
   );
}

// dashed line svg source: https://www.svgrepo.com/svg/361694/border-dashed
export function DashedLine() {
   return (
      <svg width="40" height="25" viewBox="0 0 15 15">
         <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 7.5C0 7.22386 0.223858 7 0.5 7H3C3.27614 7 3.5 7.22386 3.5 7.5C3.5 7.77614 3.27614 8 3 8H0.5C0.223858 8 0 7.77614 0 7.5ZM5.75 7.5C5.75 7.22386 5.97386 7 6.25 7H8.75C9.02614 7 9.25 7.22386 9.25 7.5C9.25 7.77614 9.02614 8 8.75 8H6.25C5.97386 8 5.75 7.77614 5.75 7.5ZM12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12Z"
            fill="#000000"
         />
      </svg>
   );
}

// dotted line svg source: https://www.svgrepo.com/svg/451059/line-dotted
export function DottedLine() {
   return (
      <svg width="40" height="25" viewBox="0 0 24 24">
         <path d="M3 11H1V13H3V11Z" fill="#000000" />
         <path d="M7 11H5V13H7V11Z" fill="#000000" />
         <path d="M9 11H11V13H9V11Z" fill="#000000" />
         <path d="M15 11H13V13H15V11Z" fill="#000000" />
         <path d="M17 11H19V13H17V11Z" fill="#000000" />
         <path d="M23 11H21V13H23V11Z" fill="#000000" />
      </svg>
   );
}

// double line svg source: https://www.svgrepo.com/svg/409213/line-double
export function DoubleLine() {
   return (
      <svg width="40" height="25" viewBox="0 0 17 17">
         <g strokeWidth="0" />
         <g strokeLinecap="round" strokeLinejoin="round" />
         <g>
            <path d="M17 6v1h-17v-1h17zM0 10h17v-1h-17v1z" fill="#000000" />
         </g>
      </svg>
   );
}
