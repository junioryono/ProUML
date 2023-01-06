import { TemplateItem } from "@/components/dashboard/diagrams/template-item";
import { cn } from "@/lib/utils";
import { DiagramTemplate } from "types";
import { ImportItem } from "./import-item";

interface NewDiagramProps extends React.HTMLAttributes<HTMLDivElement> {}

export function NewDiagram({ className, ...props }: NewDiagramProps) {
   return (
      <div className={cn("flex flex-wrap mb-4 px-3 pt-6 pb-3 bg-slate-100 rounded-md rounded-t-none", className)} {...props}>
         <ImportItem />
         {templates.map((template) => (
            <TemplateItem key={template.name} template={template} />
         ))}
      </div>
   );
}

const templates: DiagramTemplate[] = [
   {
      name: "",
      label: "Start from scratch",
      icon: "fileJSON",
   },
   {
      name: "factory_method",
      label: "Factory Method",
      icon: "fileJSON",
   },
   {
      name: "abstract_factory",
      label: "Abstract Factory",
      icon: "fileJSON",
   },
   {
      name: "builder",
      label: "Builder",
      icon: "fileJSON",
   },
   {
      name: "prototype",
      label: "Prototype",
      icon: "fileJSON",
   },
   {
      name: "singleton",
      label: "Singleton",
      icon: "fileJSON",
   },
   // {
   //    name: "adapter",
   //    label: "Adapter",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "bridge",
   //    label: "Bridge",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "composite",
   //    label: "Composite",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "decorator",
   //    label: "Decorator",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "facade",
   //    label: "Facade",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "flyweight",
   //    label: "Flyweight",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "proxy",
   //    label: "Proxy",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "chain_of_responsibility",
   //    label: "Chain of Responsibility",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "command",
   //    label: "Command",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "interpreter",
   //    label: "Interpreter",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "iterator",
   //    label: "Iterator",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "mediator",
   //    label: "Mediator",
   //    icon: "fileJSON",
   // },
   // {
   //    name: "memento",
   //    label: "Memento",
   //    icon: "fileJSON",
   // },
];
