import { Icons } from "@/components/icons";
import { Avatar } from "@/ui/avatar";
import { User } from "types";

export function UserAvatar({ user, className }: { user?: User; className?: string }) {
   return (
      <Avatar className={className}>
         <Avatar.Image alt="Picture" src={!user ? undefined : user.picture} />
         <Avatar.Fallback>
            <span className="sr-only">{!user ? undefined : user.full_name}</span>
            <Icons.user className="h-4 w-4" />
         </Avatar.Fallback>
      </Avatar>
   );
}
