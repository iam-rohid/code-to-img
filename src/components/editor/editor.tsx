"use client";

import Canvas from "./canvas";
import UI from "./ui";

export default function Editor() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-secondary/50">
      <Canvas />
      <UI />
    </div>
  );
}
