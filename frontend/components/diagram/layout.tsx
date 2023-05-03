import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import UserAccountNav from "@/components/dashboard/user-account-nav";
import { ReadyState } from "react-use-websocket";
import { Diagram, Issue, User } from "types";
import { useRouter } from "next/navigation";
import Link from "next/link";

import useX6 from "@/components/diagram/x6";
import Menu from "@/components/diagram/header/menu";
import ZoomButton from "@/components/diagram/header/zoom-button";
import ShareButton from "@/components/diagram/header/share-button";
import Selector from "@/components/diagram/header/selector";
import HandTool from "@/components/diagram/header/hand-tool";
import AddIssue from "@/components/diagram/header/add-issue";
import LeftPanel from "@/components/diagram/left-panel";
import RightPanel from "@/components/diagram/right-panel";

import Image from "next/image";
import { cn } from "@/lib/utils";
import DiagramLabel from "./header/diagram-label";

export type LayoutProps = {
   setZoom: Dispatch<SetStateAction<number>>;
   setDiagramName: Dispatch<SetStateAction<string>>;
   backgroundColor: MutableRefObject<string>;
   setBackgroundColor: Dispatch<SetStateAction<string>>;
   setConnectedUsers: Dispatch<SetStateAction<{ [key: string]: User }>>;
};

export default function DiagramLayout({ user, role, diagram }: { user: User; role: string; diagram: Diagram }) {
   const [connectedUsers, setConnectedUsers] = useState<{
      [key: string]: User; // The key is the user's color
   }>({});

   // States
   const [zoom, setZoom] = useState(1);
   const [diagramName, setDiagramName] = useState(diagram.name);
   const [backgroundColor, setBackgroundColor] = useState(diagram.background_color);
   const backgroundColorRef = useRef(backgroundColor);
   const [panning, setPanning] = useState(false);
   const [selectedIssue, setSelectedIssue] = useState<Issue>();
   const router = useRouter();

   // Core
   const container = useRef<HTMLDivElement>();
   const { graph, ready, wsTimedOut } = useX6(container, diagram, {
      setZoom,
      setDiagramName,
      backgroundColor: backgroundColorRef,
      setBackgroundColor,
      setConnectedUsers,
   });

   useEffect(() => {
      setDiagramName(diagram.name);
      setBackgroundColor(diagram.background_color);
      setSelectedIssue(undefined);
   }, [diagram]);

   useEffect(() => {
      backgroundColorRef.current = backgroundColor;
   }, [backgroundColor]);

   return (
      <div className="flex-col h-screen overflow-hidden">
         <div className="flex justify-between items-center h-12 bg-diagram-menu text-white">
            <div className="flex h-full items-center">
               {wsTimedOut ? (
                  <>
                     <Link href="/dashboard" className="flex items-center gap-2 ml-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#05a8ff]">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                           >
                              <path
                                 fillRule="evenodd"
                                 d="M10.707 3.293a1 1 0 010 1.414L7.414 8H15a1 1 0 110 2H7.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                                 clipRule="evenodd"
                              />
                           </svg>
                        </div>
                     </Link>
                  </>
               ) : (
                  <>
                     <Menu graph={graph} ready={ready} diagramName={diagramName} />
                     <Selector graph={graph} panning={panning} setPanning={setPanning} />
                     <HandTool graph={graph} panning={panning} setPanning={setPanning} />
                     <AddIssue graph={ready && graph} diagramId={diagram.id} />
                  </>
               )}
            </div>

            {/* diagram label w proj (if has one), diagram name, and diagram settings dropdown */}
            <DiagramLabel diagramName={diagramName} diagram={diagram} role={role} wsTimedOut={wsTimedOut} />

            <div className="flex h-full items-center">
               {!wsTimedOut && (
                  <div className="flex">
                     {Object.keys(connectedUsers).map((color, index) => {
                        return (
                           <Image
                              key={index}
                              src={connectedUsers[color].picture}
                              width={30}
                              height={30}
                              className={`rounded-full m-2 border-2 border-double -ml-4 only:ml-0`}
                              style={{
                                 borderColor: color,
                                 backgroundColor: color,
                              }}
                              alt="avatar"
                           />
                        );
                     })}
                  </div>
               )}
               {!wsTimedOut && <ShareButton user={user} role={role} diagram={diagram} />}
               <UserAccountNav
                  user={user}
                  className={cn("mx-2 border-2 border-double border-[#05a8ff] bg-[#05a8ff]", wsTimedOut && "mr-3")}
               />
               {!wsTimedOut && <ZoomButton graph={graph} zoom={zoom} />}
            </div>
         </div>

         {wsTimedOut ? (
            <div className="flex justify-center items-center w-full h-full pb-36">
               <div className="flex flex-col items-center gap-2">
                  <div className="text-gray-500">Connection timed out</div>
                  <div className="text-gray-500">Please refresh the page</div>
                  <div
                     onClick={() => router.refresh()}
                     className="cursor-pointer mt-1.5 transition duration-500 hover:scale-125"
                  >
                     <svg width="25" height="25" fill="#666666" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                           <path
                              d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0"
                              fillRule="evenodd"
                           ></path>
                        </g>
                     </svg>
                  </div>
               </div>
            </div>
         ) : (
            <>
               {!ready && (
                  <div className="flex justify-center items-center w-full h-full pb-36">
                     <div className="flex flex-col justify-center items-center gap-2">
                        <div className="flex items-center justify-center">
                           <div
                              className="inline-block h-24 w-24 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.0s_linear_infinite]"
                              role="status"
                           >
                              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                 Loading...
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               <div className="flex text-sm">
                  {ready && (
                     <LeftPanel
                        diagram={diagram}
                        graph={graph}
                        selectedIssue={selectedIssue}
                        setSelectedIssue={setSelectedIssue}
                     />
                  )}

                  <div className="flex-1">
                     <div ref={(rf) => (container.current = rf)} />
                  </div>

                  {ready && <RightPanel graph={graph} backgroundColor={backgroundColor} selectedIssue={selectedIssue} />}
               </div>
            </>
         )}
      </div>
   );
}
