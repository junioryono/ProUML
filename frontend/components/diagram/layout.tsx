import { Dispatch, MutableRefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import UserAccountNav from "@/components/dashboard/user-account-nav";
import { ReadyState } from "react-use-websocket";
import { Diagram, User } from "types";
import Link from "next/link";

import useX6 from "@/components/diagram/x6";
import Menu from "@/components/diagram/header/menu";
import ZoomButton from "@/components/diagram/header/zoom-button";
import ShareButton from "@/components/diagram/header/share-button";
import Selector from "@/components/diagram/header/selector";
import Components from "@/components/diagram/header/components";
import HandTool from "@/components/diagram/header/hand-tool";
import AddComment from "@/components/diagram/header/add-comment";
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
                     <Menu graph={graph} />
                     <Selector graph={graph} panning={panning} setPanning={setPanning} />
                     <HandTool graph={graph} panning={panning} setPanning={setPanning} />
                     <Components graph={graph} />
                     <AddComment graph={graph} />
                  </>
               )}
            </div>

            {/* diagram label w proj (if has one), diagram name, and diagram settings dropdown */}
            <DiagramLabel diagram={diagram} role={role} wsTimedOut={wsTimedOut} />

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
               </div>
            </div>
         ) : (
            <div className="flex text-sm">
               {!ready && (
                  <div className="flex justify-center items-center w-full h-full">
                     <div className="flex flex-col items-center gap-2">
                        <div className="text-gray-500">Loading...</div>
                     </div>
                  </div>
               )}

               {ready && <LeftPanel diagram={diagram} graph={graph} />}

               <div className="flex-1">
                  <div ref={(rf) => (container.current = rf)} />
               </div>

               {ready && <RightPanel graph={graph} backgroundColor={backgroundColor} />}
            </div>
         )}
      </div>
   );
}
