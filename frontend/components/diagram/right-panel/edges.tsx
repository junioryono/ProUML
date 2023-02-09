"use client";

import type X6Type from "@antv/x6";
import { MutableRefObject, useState } from "react";
import { backgroundColorOptions, borderColorOptions } from ".";

export default function EdgesPanel({ graph }: { graph: MutableRefObject<X6Type.Graph> }) {
   return (
      <>
         <div>Edges</div>
      </>
   );
}
