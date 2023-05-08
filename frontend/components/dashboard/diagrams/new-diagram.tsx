import { cn } from "@/lib/utils";
import { DiagramTemplate, Project } from "types";
import ImportItem from "@/components/dashboard/diagrams/import-item";
import TemplateItem from "@/components/dashboard/diagrams/template-item";

interface NewDiagramProps extends React.HTMLAttributes<HTMLDivElement> {
   project?: Project;
}

export default function NewDiagram({ className, project, ...props }: NewDiagramProps) {
   console.log("project2", project);
   return (
      <div
         className={cn(
            "flex justify-center flex-wrap max-w-[calc(100vw-3rem)] overflow-x-auto overflow-y-hidden pl-2 pr-4 pt-3 pb-4 bg-slate-100 rounded-md",
            //"flex lg:flex-nowrap no-scrollbar max-w-[calc(100vw-3rem)] overflow-x-auto overflow-y-hidden mb-4 px-3 pt-4 bg-slate-100 rounded-md rounded-t-none",
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
   {
      name: "adapter",
      label: "Adapter",
      image: "https://refactoring.guru/images/patterns/cards/adapter-mini-2x.png",
   },
   {
      name: "observer",
      label: "Observer",
      image: "https://refactoring.guru/images/patterns/cards/observer-mini-2x.png?id=f205b0655572ac8e4636691c0e0debfd",
   },
   {
      name: "strategy",
      label: "Strategy",
      image: "https://refactoring.guru/images/patterns/cards/strategy-mini-2x.png?id=f4e6608561f8e5d18be6927d4620ad29",
   },
   {
      name: "state",
      label: "State",
      image: "https://refactoring.guru/images/patterns/cards/state-mini-2x.png?id=7e24398b27a43c7bd286fc0ea54d2a35",
   },
   {
      name: "template_method",
      label: "Template Method",
      image: "https://refactoring.guru/images/patterns/cards/template-method-mini-2x.png?id=178bf56e39b3a1f548dd636076209c98",
   },
   {
      name: "visitor",
      label: "Vistor",
      image: "https://refactoring.guru/images/patterns/cards/visitor-mini-2x.png?id=9b87f3f3b772f434b28a25876829b504",
   },
   {
      name: "bridge",
      label: "Bridge",
      image: "https://refactoring.guru/images/patterns/cards/bridge-mini-2x.png",
   },
   {
      name: "composite",
      label: "Composite",
      image: "https://refactoring.guru/images/patterns/cards/composite-mini-2x.png",
   },
   {
      name: "decorator",
      label: "Decorator",
      image: "https://refactoring.guru/images/patterns/cards/decorator-mini-2x.png",
   },
   {
      name: "facade",
      label: "Facade",
      image: "https://refactoring.guru/images/patterns/cards/facade-mini-2x.png",
   },
   {
      name: "flyweight",
      label: "Flyweight",
      image: "https://refactoring.guru/images/patterns/cards/flyweight-mini-2x.png",
   },
   {
      name: "proxy",
      label: "Proxy",
      image: "https://refactoring.guru/images/patterns/cards/proxy-mini-2x.png",
   },
   {
      name: "chain_of_responsibility",
      label: "Chain of Responsibility",
      image: "https://refactoring.guru/images/patterns/cards/chain-of-responsibility-mini-2x.png",
   },
   {
      name: "command",
      label: "Command",
      image: "https://refactoring.guru/images/patterns/cards/command-mini-2x.png",
   },
   {
      name: "iterator",
      label: "Iterator",
      image: "https://refactoring.guru/images/patterns/cards/iterator-mini-2x.png",
   },
   {
      name: "mediator",
      label: "Mediator",
      image: "https://refactoring.guru/images/patterns/cards/mediator-mini-2x.png",
   },
   {
      name: "memento",
      label: "Memento",
      image: "https://refactoring.guru/images/patterns/cards/memento-mini-2x.png",
   },
];
