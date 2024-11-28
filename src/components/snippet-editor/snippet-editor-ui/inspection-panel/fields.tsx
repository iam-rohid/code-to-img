import { ReactNode, useId } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Link2Icon,
  Unlink2Icon,
} from "lucide-react";

import { InspectorNumberInput } from "@/components/inspector-number-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { iPadding } from "@/lib/validator/elements/shared";

export function SwitchField({
  checked,
  label,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange?: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex h-12 items-center justify-between gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function ToggleGroupField({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="flex h-12 items-center justify-between gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex h-10 gap-0.5 rounded-lg border p-0.5">
        {options.map((option) => (
          <Button
            variant="ghost"
            key={option.value}
            className={cn("h-full rounded-sm px-3", {
              "bg-accent text-accent-foreground": option.value === value,
            })}
            onClick={() => onValueChange?.(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function NumberField({
  label,
  value,
  onValueChange,
  max,
  min,
  icon,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  icon: ReactNode;
  onValueChange?: (value: number) => void;
}) {
  const id = useId();

  return (
    <div className="grid h-12 grid-cols-[1fr,6rem] items-center gap-2 px-2">
      <Label htmlFor={id}>{label}</Label>
      <InspectorNumberInput
        id={id}
        icon={icon}
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
      />
    </div>
  );
}

export function Padding({
  onPaddingChange,
  value,
}: {
  value: iPadding;
  onPaddingChange: (value: iPadding) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr,24px,1fr] items-center gap-x-1 gap-y-2">
      <InspectorNumberInput
        min={0}
        value={value.top}
        icon={<ChevronUpIcon />}
        onValueChange={(top) =>
          onPaddingChange({
            ...value,
            top,
            bottom: value.verticalLinked ? top : value.bottom,
          })
        }
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() =>
              onPaddingChange({
                ...value,
                verticalLinked: !value.verticalLinked,
              })
            }
          >
            {value.verticalLinked ? <Link2Icon /> : <Unlink2Icon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Link Vertical Padding</TooltipContent>
      </Tooltip>

      <InspectorNumberInput
        min={0}
        value={value.bottom}
        icon={<ChevronDownIcon />}
        onValueChange={(bottom) =>
          onPaddingChange({
            ...value,
            bottom,
            top: value.verticalLinked ? bottom : value.top,
          })
        }
      />

      <InspectorNumberInput
        min={0}
        value={value.left}
        icon={<ChevronLeftIcon />}
        onValueChange={(left) =>
          onPaddingChange({
            ...value,
            left,
            right: value.horizontalLinked ? left : value.right,
          })
        }
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() =>
              onPaddingChange({
                ...value,
                horizontalLinked: !value.horizontalLinked,
              })
            }
          >
            {value.horizontalLinked ? <Link2Icon /> : <Unlink2Icon />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Link Horizontal Padding</TooltipContent>
      </Tooltip>

      <InspectorNumberInput
        min={0}
        value={value.right}
        icon={<ChevronRightIcon />}
        onValueChange={(right) =>
          onPaddingChange({
            ...value,
            right,
            left: value.horizontalLinked ? right : value.left,
          })
        }
      />
    </div>
  );
}
