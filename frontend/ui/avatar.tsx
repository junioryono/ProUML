import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type AvatarProps = AvatarPrimitive.AvatarProps;

export function Avatar({ className, ...props }: AvatarProps) {
   return (
      <AvatarPrimitive.Root
         className={cn(
            "duration-500 hover:scale-110 flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full bg-slate-100 m-1",
            className,
         )}
         {...props}
      />
   );
}

type AvatarImageProps = AvatarPrimitive.AvatarImageProps;

Avatar.Image = function AvatarImage({ className, ...props }: AvatarImageProps) {
   return <AvatarPrimitive.Image className={cn("", className)} {...props} />;
};

Avatar.Fallback = function AvatarFallback({ className, children, ...props }: AvatarPrimitive.AvatarFallbackProps) {
   return (
      <AvatarPrimitive.Fallback delayMs={1000} className={cn("", className)} {...props}>
         {children}
      </AvatarPrimitive.Fallback>
   );
};
