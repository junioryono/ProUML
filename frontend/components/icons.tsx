import {
   AlertTriangle,
   ArrowRight,
   Check,
   ChevronLeft,
   ChevronRight,
   Command,
   CreditCard,
   File,
   FileText,
   Github,
   HelpCircle,
   Image,
   Loader2,
   MoreVertical,
   Pizza,
   Plus,
   Server,
   Settings,
   Trash,
   Twitter,
   User,
   Users,
   FileJson,
   X,
   Bug,
   FileImage,
} from "lucide-react";
import type { Icon as LucideIcon } from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
   logo: Command,
   close: X,
   spinner: Loader2,
   chevronLeft: ChevronLeft,
   chevronRight: ChevronRight,
   trash: Trash,
   post: FileText,
   page: File,
   media: Image,
   settings: Settings,
   billing: CreditCard,
   ellipsis: MoreVertical,
   add: Plus,
   warning: AlertTriangle,
   user: User,
   users: Users,
   arrowRight: ArrowRight,
   help: HelpCircle,
   pizza: Pizza,
   gitHub: Github,
   twitter: Twitter,
   check: Check,
   server: Server,
   fileJSON: FileJson,
   bug: Bug,
   fileImage: FileImage,
};
