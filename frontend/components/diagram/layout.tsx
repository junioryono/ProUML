import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
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

export type LayoutProps = {
   setZoom: Dispatch<SetStateAction<number>>;
   setDiagramName: Dispatch<SetStateAction<string>>;
   setBackgroundColor: Dispatch<SetStateAction<string>>;
   setConnectedUsers: Dispatch<SetStateAction<{ [key: string]: User }>>;
};

export default function DiagramLayout({ user, diagram }: { user: User; diagram: Diagram }) {
   const [connectedUsers, setConnectedUsers] = useState<{
      [key: string]: User; // The key is the user's color
   }>({});

   // States
   const [zoom, setZoom] = useState(1);
   const [diagramName, setDiagramName] = useState(diagram.name);
   const [backgroundColor, setBackgroundColor] = useState(diagram.background_color);
   const [panning, setPanning] = useState(false);

   // Core
   const container = useRef<HTMLDivElement>();
   const { graph, sessionId, ready } = useX6(container, diagram, {
      setZoom,
      setDiagramName,
      setBackgroundColor,
      setConnectedUsers,
   });

   const refContainer = useCallback((containerParam: HTMLDivElement) => {
      container.current = containerParam;
   }, []);

   return (
      <div className="flex-col h-screen overflow-hidden">
         <div className="flex justify-between items-center h-12 bg-diagram-menu text-white">
            <div className="flex h-full items-center">
               <Menu graph={graph} />
               <Selector graph={graph} panning={panning} setPanning={setPanning} />
               <HandTool graph={graph} panning={panning} setPanning={setPanning} />
               <Components graph={graph} />
               <AddComment graph={graph} />
            </div>
            <div className="basis-2/4 flex justify-center items-center gap-2 text-sm select-none">
               {diagram.project && (
                  <>
                     <Link
                        href={"/dashboard/projects/[id]"}
                        as={`/dashboard/projects/${diagram.project.id}`}
                        className="opacity-70 hover:opacity-100 cursor-pointer"
                     >
                        {diagram.project.name}
                     </Link>
                     <div className="opacity-30 text-xl font-light">/</div>
                  </>
               )}
               <div>{diagramName}</div>
               <svg className="svg" width="8" height="7" viewBox="0 0 8 7" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
                     fillRule="evenodd"
                     fillOpacity="1"
                     fill="#000"
                     stroke="none"
                     className="fill-white"
                  />
               </svg>
            </div>
            <div className="flex h-full items-center">
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
               <ShareButton user={user} diagram={diagram} />
               <UserAccountNav user={user} className="mx-2 border-2 border-double border-[#05a8ff] bg-[#05a8ff]" />
               <ZoomButton graph={graph} zoom={zoom} />
            </div>
         </div>
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
               <div ref={refContainer} />
            </div>

            {ready && <RightPanel graph={graph} backgroundColor={backgroundColor} />}
         </div>
      </div>
   );
}
