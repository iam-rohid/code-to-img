"use client";

import { ReactNode } from "react";
import { DndProvider as ReactDndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function DndProvider({ children }: { children: ReactNode }) {
  return <ReactDndProvider backend={HTML5Backend}>{children}</ReactDndProvider>;
}
