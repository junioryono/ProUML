import { TemplateItem } from "@/components/dashboard/diagrams/template-item";
import { cn } from "@/lib/utils";
import { DiagramTemplate, Project } from "types";
import { ImportItem } from "./import-item";

interface NewDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
   project?: Project;
}

export function NewDiagram({ className, project, ...props }: NewDiagramProps) {
   return (
      <div
         className={cn(
            "flex lg:flex-wrap max-w-[calc(100vw-3rem)] mb-4 px-3 pt-4 bg-slate-100 rounded-md rounded-t-none overflow-x-auto no-scrollbar",
            className,
         )}
         {...props}
      >
         <ImportItem project={project} />
         {templates.map((template) => (
            <TemplateItem key={template.name} template={template} project={project} />
         ))}
      </div>
   );
}

const templates: DiagramTemplate[] = [
   {
      name: "",
      label: "Start from scratch",
      image: "",
   },
   {
      name: "factory_method",
      label: "Factory Method",
      image: "https://refactoring.guru/images/patterns/cards/factory-method-mini-3x.png",
   },
   {
      name: "abstract_factory",
      label: "Abstract Factory",
      image: "https://refactoring.guru/images/patterns/cards/abstract-factory-mini.png",
   },
   {
      name: "builder",
      label: "Builder",
      image: "https://refactoring.guru/images/patterns/cards/builder-mini.png?id=19b95fd05e6469679752c0554b116815",
   },
   {
      name: "prototype",
      label: "Prototype",
      image: "https://refactoring.guru/images/patterns/cards/prototype-mini.png?id=bc3046bb39ff36574c08d49839fd1c8e",
   },
   {
      name: "singleton",
      label: "Singleton",
      image: "https://refactoring.guru/images/patterns/cards/singleton-mini.png?id=914e1565dfdf15f240e766163bd303ec",
   },
   // {
   //    name: "adapter",
   //    label: "Adapter",
   //    image: "",
   // },
   // {
   //    name: "bridge",
   //    label: "Bridge",
   //    image: "",
   // },
   // {
   //    name: "composite",
   //    label: "Composite",
   //    image: "",
   // },
   // {
   //    name: "decorator",
   //    label: "Decorator",
   //    image: "",
   // },
   // {
   //    name: "facade",
   //    label: "Facade",
   //    image: "",
   // },
   // {
   //    name: "flyweight",
   //    label: "Flyweight",
   //    image: "",
   // },
   // {
   //    name: "proxy",
   //    label: "Proxy",
   //    image: "",
   // },
   // {
   //    name: "chain_of_responsibility",
   //    label: "Chain of Responsibility",
   //    image: "",
   // },
   // {
   //    name: "command",
   //    label: "Command",
   //    image: "",
   // },
   // {
   //    name: "interpreter",
   //    label: "Interpreter",
   //    image: "",
   // },
   // {
   //    name: "iterator",
   //    label: "Iterator",
   //    image: "",
   // },
   // {
   //    name: "mediator",
   //    label: "Mediator",
   //    image: "",
   // },
   // {
   //    name: "memento",
   //    label: "Memento",
   //    image: "",
   // },
];
