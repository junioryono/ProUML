import { cn } from "@/lib/utils";

export default function EdgeJumps({
   jump,
   setJump,
}: {
   jump: string;
   setJump: React.Dispatch<React.SetStateAction<string>>;
}) {
   // list with line width options and their icons
   const jumpOptions = [
      {
         // jump over other edges
         jump: "jump",
         icon: <div>None</div>,
      },
      {
         // jump over other edges
         router: "jump",
         icon: (
            <svg fill="#000000" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" width="40" height="25">
               <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
               <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <path
                     d="M26.572 175.798l-.423 16.215s6.07-.61 16.657-3.59c10.586-2.978 10.222-.383 20.515-9.87 10.293-9.486 9.362-6.84 15.235-20.838 5.873-13.998 5.28-12.871 7.91-25.156 2.63-12.286 2.907-16.198 7.088-26.018 4.18-9.82 4.448-10.736 10.46-16.25 6.014-5.514 9.596-6.742 16.67-8.629 7.074-1.887 8.357-2.026 16.579.3 8.221 2.327 6.33.988 13.914 8.329 7.583 7.34 6.95 6.504 11.476 16.25 4.527 9.746 3.555 10.641 6.431 20.151s3.3 11.71 5.393 18.947c2.091 7.236 1.493 7.698 4.265 14.464 2.772 6.765 2.963 8.233 7.104 13.287 4.14 5.053 3.365 5.15 11.273 9.14 7.908 3.99 11.118 5.02 18.61 6.939 7.493 1.92 15.641 1.836 15.641 1.836l.339-16.327s-11.697.108-20.815-3.749c-9.12-3.856-8.863-4.217-15.464-14.17-6.602-9.953-2.691-5.123-7.283-19.616-4.59-14.492-4.386-16.372-8.116-27.993-3.73-11.62-3.692-14.478-10.296-23.138-6.603-8.66-9.682-10.42-18.784-15.001-9.102-4.582-13.384-5.268-22.453-5.756-9.069-.488-8.27-.513-18.477 3.552-10.207 4.066-9.839 3.645-17.729 10.868-7.89 7.222-7.031 6.35-11.785 16.148-4.754 9.798-4.66 9.053-6.893 20.284-2.232 11.232-2.47 12.362-5.41 22.469-2.942 10.107-3.318 13.965-6.975 20.092-3.656 6.126-2.394 6.64-11.667 11.143-9.273 4.503-22.99 5.687-22.99 5.687z"
                     fillRule="evenodd"
                  ></path>
               </g>
            </svg>
         ),
      },
      {
         // gap between other edges
         jump: "gap",
         icon: (
            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="25">
               <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
               <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
               <g id="SVGRepo_iconCarrier">
                  <path
                     fillRule="evenodd"
                     clipRule="evenodd"
                     d="M0 7.5C0 7.22386 0.223858 7 0.5 7H3C3.27614 7 3.5 7.22386 3.5 7.5C3.5 7.77614 3.27614 8 3 8H0.5C0.223858 8 0 7.77614 0 7.5ZM5.75 7.5C5.75 7.22386 5.97386 7 6.25 7H8.75C9.02614 7 9.25 7.22386 9.25 7.5C9.25 7.77614 9.02614 8 8.75 8H6.25C5.97386 8 5.75 7.77614 5.75 7.5ZM12 7C11.7239 7 11.5 7.22386 11.5 7.5C11.5 7.77614 11.7239 8 12 8H14.5C14.7761 8 15 7.77614 15 7.5C15 7.22386 14.7761 7 14.5 7H12Z"
                     fill="#000000"
                  ></path>
               </g>
            </svg>
         ),
      },
   ];

   return (
      <div className="flex items-center gap-2 pl-2">
         {/* map out all of the router options */}
         {jumpOptions.map((option) => (
            <button
               key={option.jump}
               className={cn(
                  "border w-14 h-7 flex items-center justify-center rounded-md transition duration-500 hover:scale-[1.2]",
                  jump !== option.jump ? "border-slate-400 bg-slate-200" : "border-slate-600 bg-slate-400",
               )}
               onClick={() => setJump(option.jump)}
            >
               {option.icon}
            </button>
         ))}
      </div>
   );
}
