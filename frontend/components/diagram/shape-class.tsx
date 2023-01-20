import { Graph, Node } from "@antv/x6";
import { register } from "@antv/x6-react-shape";

const enum ClassSection {
   Name,
   Variables,
   Methods,
}

function ClassComponent({ node }: { node?: Node }) {
   console.log("node", node);

   return (
      <div className="bg-black w-full h-full">
         <div className="text-white">Hello</div>
      </div>
   );
}

register({
   shape: "custom-class",
   component: ClassComponent,
});
