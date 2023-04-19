import { Project } from "types";
import { createProject } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/ui/toast";
import { LongPressDetectEvents, useLongPress } from "use-long-press";

import CreateButton from "@/components/dashboard/create-button";
import SelectedItemsOptions from "@/components/dashboard/projects/selected-items-options";

export default function ProjectsHeader({
   projects,
   selectingItems,
   setSelectingItems,
   selectedItems,
   setSelectedItems,
}: {
   projects: Project[];
   selectingItems: boolean;
   setSelectingItems: (value: boolean) => void;
   selectedItems: Project[];
   setSelectedItems: (value: Project[]) => void;
}) {
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [showMenu, setShowMenu] = useState(false);
   const linkRef = useRef<HTMLAnchorElement>(null);

   async function onClickHandler() {
      if (isLoading) {
         return;
      }

      setIsLoading(true);

      const formData = new FormData();

      createProject(formData)
         .then((res) => {
            if (res.success === false) {
               throw new Error(res.reason);
            }

            router.refresh();

            return toast({
               title: "Success!",
               message: "Your team was successfuly created!",
               type: "success",
            });
         })
         .catch((error) => {
            console.error(error);
            return toast({
               title: "Something went wrong.",
               message: error.message,
               type: "error",
            });
         })
         .finally(() => setIsLoading(false));
   }

   function handleClickOutside(event: Event) {
      if (linkRef.current && !linkRef.current.contains(event.target as Node)) {
         setShowMenu(false);
      }
   }

   const onLongPress = useLongPress(
      () => {
         setShowMenu(true);
      },
      {
         cancelOnMovement: true,
         threshold: 700,
         detect: LongPressDetectEvents.TOUCH,
      },
   );

   // close the menu when the user clicks outside of it
   useEffect(() => {
      if (!showMenu) return;

      document.addEventListener("click", handleClickOutside, true);
      document.addEventListener("touchstart", handleClickOutside, true);
      return () => {
         document.removeEventListener("click", handleClickOutside, true);
         document.addEventListener("touchstart", handleClickOutside, true);
      };
   }, [showMenu]);

   // if the user presses the escape key while selecting items, close the selection
   useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setSelectingItems(false);
            setSelectedItems([]);
         }
      };

      window.addEventListener("keydown", handleEscape);

      return () => {
         window.removeEventListener("keydown", handleEscape);
      };
   }, [setSelectingItems, setSelectedItems]);

   return (
      <div className="flex gap-3 items-center">
         {!selectingItems ? (
            <>
               {projects.length > 1 && (
                  <button
                     className="self-center relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                     onClick={() => setSelectingItems(true)}
                  >
                     Select
                  </button>
               )}

               <CreateButton title="New project" isLoading={isLoading} onClick={onClickHandler} />
            </>
         ) : (
            <>
               {/* show the amount of items selected if there are any selected */}
               {selectedItems.length > 0 ? (
                  <>
                     <span className="font-medium text-slate-900 text-center">{selectedItems.length} selected</span>
                     <SelectedItemsOptions showMenu={showMenu} setShowMenu={setShowMenu} selectedItems={selectedItems} />
                  </>
               ) : (
                  <span className="font-medium text-slate-900 mr-3">Select items</span>
               )}

               <button
                  className="relative inline-flex h-9 items-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm flex-none font-medium text-white hover:bg-brand-400 focus:outline-none"
                  onClick={() => {
                     setSelectingItems(false);
                     // empty the selected items array
                     setSelectedItems([]);
                  }}
               >
                  Cancel
               </button>
            </>
         )}
      </div>
   );
}
