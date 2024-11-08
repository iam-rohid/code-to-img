import { iElement, useEditorStore } from "@/store/editor-store";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStartIcon,
  AlignVerticalJustifyCenterIcon,
  AlignVerticalJustifyEndIcon,
  AlignVerticalJustifyStartIcon,
  Link2Icon,
  RotateCcwIcon,
  Unlink2Icon,
} from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function InspectionPanel() {
  const element = useEditorStore((state) =>
    state.selectedElementId
      ? (state.canvas.elements.find(
          (element) => element.id === state.selectedElementId,
        ) ?? null)
      : null,
  );

  if (!element) {
    return null;
  }

  return (
    <div className="pointer-events-auto flex w-72 flex-col overflow-y-auto rounded-lg bg-background">
      <AlignmentOptions element={element} />
      <Separator />
      <Transform element={element} />
    </div>
  );
}

function AlignmentOptions({ element }: { element: iElement }) {
  const alignElement = useEditorStore((state) => state.alignElement);
  return (
    <div className="flex items-center justify-between p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "start-horizontal")}
      >
        <AlignHorizontalJustifyStartIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "center-horizontal")}
      >
        <AlignHorizontalJustifyCenterIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "end-horizontal")}
      >
        <AlignHorizontalJustifyEndIcon />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "start-vertical")}
      >
        <AlignVerticalJustifyStartIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "center-vertical")}
      >
        <AlignVerticalJustifyCenterIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => alignElement(element.id, "end-vertical")}
      >
        <AlignVerticalJustifyEndIcon />
      </Button>
    </div>
  );
}

function Transform({ element }: { element: iElement }) {
  const setElemet = useEditorStore((state) => state.setElement);

  return (
    <div className="grid grid-cols-[1fr,24px,1fr,24px] items-center gap-x-1 gap-y-2 p-2">
      <NumberInputWithIcon
        value={element.position.x}
        icon={<span>X</span>}
        onValueChange={(value) => {
          setElemet({
            ...element,
            position: { ...element.position, x: value },
          });
        }}
      />
      <div></div>
      <NumberInputWithIcon
        value={element.position.y}
        icon={<span>Y</span>}
        onValueChange={(value) => {
          setElemet({
            ...element,
            position: { ...element.position, y: value },
          });
        }}
      />
      <div></div>
      <NumberInputWithIcon
        value={element.width}
        icon={<span>W</span>}
        onValueChange={(value) => {
          const width = value;
          let height = element.height;
          if (element.widthHeightLinked) {
            height = (element.height * width) / element.width;
          }
          setElemet({
            ...element,
            width,
            height,
          });
        }}
      />
      <Button
        size="icon"
        variant="outline"
        className="h-6 w-6"
        onClick={() =>
          setElemet({
            ...element,
            widthHeightLinked: !element.widthHeightLinked,
          })
        }
      >
        {element.widthHeightLinked ? <Link2Icon /> : <Unlink2Icon />}
      </Button>
      <NumberInputWithIcon
        value={element.height}
        icon={<span>H</span>}
        onValueChange={(value) => {
          const height = value;
          let width = element.width;
          if (element.widthHeightLinked) {
            width = (element.width * height) / element.height;
          }
          setElemet({
            ...element,
            height,
            width,
          });
        }}
      />
      <div></div>
      <NumberInputWithIcon
        value={element.rotation}
        icon={<span>R</span>}
        onValueChange={(value) => {
          setElemet({
            ...element,
            rotation: value,
          });
        }}
      />
      <Button
        size="icon"
        variant="outline"
        className="h-6 w-6"
        onClick={() => {
          setElemet({ ...element, rotation: 0 });
        }}
      >
        <RotateCcwIcon />
      </Button>
      <NumberInputWithIcon
        value={element.scale * 100}
        icon={<span>S</span>}
        onValueChange={(value) => {
          setElemet({
            ...element,
            scale: value / 100,
          });
        }}
      />
      <Button
        size="icon"
        variant="outline"
        className="h-6 w-6"
        onClick={() => {
          setElemet({ ...element, scale: 1 });
        }}
      >
        <RotateCcwIcon />
      </Button>
    </div>
  );
}

function NumberInputWithIcon({
  icon,
  onValueChange,
  value,
}: {
  value: number;
  onValueChange: (value: number) => void;
  icon: ReactNode;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (text !== String(value)) {
      setText(String(value));
    }
  }, [text, value]);

  return (
    <fieldset className="relative">
      <Input
        type="number"
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
          const newValue = parseFloat(e.currentTarget.value);
          if (!isNaN(newValue)) {
            onValueChange(newValue);
          }
        }}
        className="pl-10"
      />
      <span className="pointer-events-none absolute bottom-0 left-0 top-0 flex w-10 items-center justify-center text-center text-sm text-muted-foreground">
        {icon}
      </span>
    </fieldset>
  );
}
