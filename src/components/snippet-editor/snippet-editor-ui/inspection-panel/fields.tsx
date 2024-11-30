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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  options: { value: string; label: string; icon?: ReactNode }[];
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
            className={cn("h-full rounded-sm", {
              "bg-accent text-accent-foreground": option.value === value,
              "px-3": !option.icon,
              "w-9": option.icon,
            })}
            onClick={() => onValueChange?.(option.value)}
            title={option.label}
          >
            {option.icon ?? option.label}
            {option.icon && <p className="sr-only">{option.label}</p>}
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

const BOX_SHADOWS: string[] = [
  "none",
  "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
  "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
  "rgb(38, 57, 77) 0px 20px 30px -10px",
  "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
  "0 7px 30px -10px rgba(150,170,180,0.5)",
  "0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09)",
  "rgba(0, 0, 0, 0.1) 0px 10px 50px",
];
export function BoxShadowField({
  onValueChange,
  value,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="p-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            Box Shadow
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-fit">
          <div className="grid grid-cols-3 gap-12 rounded-lg bg-white p-12">
            {BOX_SHADOWS.map((boxShadow, i) => (
              <button
                key={i}
                style={{ boxShadow }}
                className="aspect-square w-20 rounded-md border border-zinc-200 transition-transform hover:scale-105"
                onClick={() => onValueChange(boxShadow)}
              />
            ))}
          </div>
          <Input
            value={value}
            onChange={(e) => onValueChange(e.currentTarget.value)}
            className="mt-4 w-full"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
