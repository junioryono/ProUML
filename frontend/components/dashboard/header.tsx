interface DashboardHeaderProps {
   heading: string;
   text?: string;
   children?: React.ReactNode;
}

export default function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
   return (
      <div className="flex justify-between px-2 cursor-default">
         <div className="grid gap-1">
            <h1 className="text-2xl font-bold tracking-wide text-slate-900">{heading}</h1>
            {text && <p className="text-neutral-500">{text}</p>}
         </div>
         {children}
      </div>
   );
}
