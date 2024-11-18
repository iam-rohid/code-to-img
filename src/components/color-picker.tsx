import { useContext } from "react";
import { PipetteIcon } from "lucide-react";
import {
  ColorArea,
  ColorAreaProps,
  ColorField,
  ColorFieldProps,
  ColorPickerStateContext,
  ColorSlider,
  ColorSliderProps,
  ColorSwatch,
  ColorSwatchProps,
  ColorThumb,
  Input,
  parseColor,
  SliderTrack,
} from "react-aria-components";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

export function MyColorArea({ className, ...props }: ColorAreaProps) {
  return (
    <ColorArea
      className={cn("flex-shrink-0 rounded-lg border", className)}
      {...props}
    >
      <ColorThumb className="box-border h-6 w-6 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(0,0,0,0.5)] data-[focus-visible]:h-7 data-[focus-visible]:w-7" />
    </ColorArea>
  );
}

export function MyColorSlider(props: ColorSliderProps) {
  return (
    <ColorSlider {...props}>
      <SliderTrack
        style={({ defaultStyle }) => ({
          background: `${defaultStyle.background},
            repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
        })}
        className="h-8 rounded-lg border"
      >
        <ColorThumb className="top-1/2 box-border h-6 w-6 rounded-full border-2 shadow-[0_0_0_1px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(0,0,0,0.5)] data-[focus-visible]:h-7 data-[focus-visible]:w-7" />
      </SliderTrack>
    </ColorSlider>
  );
}

export function MyColorField(props: ColorFieldProps) {
  return (
    <ColorField {...props}>
      <Input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
    </ColorField>
  );
}
export function MyColorSwatch({ className, ...props }: ColorSwatchProps) {
  return (
    <ColorSwatch
      style={({ color }) => ({
        background: `linear-gradient(${color}, ${color}),
        repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
      })}
      className={cn("h-10 w-10 flex-shrink-0 rounded-lg border", className)}
      {...props}
    />
  );
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EyeDropper?: any;
  }
}

export function MyEyeDroper() {
  const colorPicker = useContext(ColorPickerStateContext);

  if (!("EyeDropper" in window)) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={async () => {
        try {
          const eyeDropper = new window.EyeDropper();
          const result = await eyeDropper.open();
          if ("sRGBHex" in result) {
            const color = parseColor(result.sRGBHex);
            colorPicker.setColor(color);
          } else {
            toast.error("Failed to pick color!");
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Failed to pick color!");
        }
      }}
    >
      <PipetteIcon />
    </Button>
  );
}
