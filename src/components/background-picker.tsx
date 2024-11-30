"use client";

import { Fragment, useCallback, useMemo } from "react";
import { PlusIcon } from "lucide-react";
import { ColorPicker } from "react-aria-components";

import { iColor, iGradientColor } from "@/lib/validator/color";

import {
  MyColorArea,
  MyColorField,
  MyColorSlider,
  MyColorSwatch,
  MyEyeDroper,
} from "./color-picker";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function BackgroundPicker({
  color,
  onColorChange,
}: {
  color: iColor;
  onColorChange?: (color: iColor) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-full transition-none"
          variant="outline"
          style={{
            background: `linear-gradient(${color.type === "gradient" ? color.angle : 0}deg, ${color.type === "solid" ? [color.color, color.color].join(", ") : color.colors.join(", ")}),
              repeating-conic-gradient(#CCC 0% 25%, white 0% 50%) 50% / 16px 16px`,
          }}
        />
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <Tabs defaultValue={color.type}>
          <TabsList className="w-full">
            <TabsTrigger value="solid" className="w-full">
              Solid
            </TabsTrigger>
            <TabsTrigger value="gradient" className="w-full">
              Gradient
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-4" value="solid">
            <SolidPicker
              color={color.type === "solid" ? color.color : undefined}
              onColorChange={(color) => {
                onColorChange?.({ type: "solid", color });
              }}
            />
          </TabsContent>
          <TabsContent className="mt-4" value="gradient">
            <GradientPicker color={color} onColorChange={onColorChange} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export function SolidColorPicker({
  color,
  onColorChange,
}: {
  color: string;
  onColorChange?: (color: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-full transition-none"
          variant="outline"
          style={{
            backgroundColor: color,
          }}
        />
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <SolidPicker
          color={color}
          onColorChange={(color) => {
            onColorChange?.(color);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export function SolidPicker({
  color,
  onColorChange,
}: {
  color?: string;
  onColorChange?: (color: string) => void;
}) {
  return (
    <ColorPicker
      defaultValue={color}
      onChange={(color) => {
        onColorChange?.(color.toFormat("rgba").toString());
      }}
    >
      <div className="flex flex-col space-y-4">
        <MyColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="aspect-square w-full"
        />
        <MyColorSlider colorSpace="hsb" channel="hue" />
        <MyColorSlider colorSpace="hsb" channel="alpha" />
        <div className="flex gap-2">
          <MyColorSwatch />
          <MyColorField colorSpace="hsb" className="flex-1" />
          <MyEyeDroper />
        </div>
      </div>
    </ColorPicker>
  );
}

export function GradientPicker({
  color: gradient,
  onColorChange,
}: {
  color: iColor;
  onColorChange?: (color: iGradientColor) => void;
}) {
  const angle = useMemo(
    () => (gradient.type === "gradient" ? gradient.angle : 90),
    [gradient],
  );

  const colors = useMemo(() => {
    if (gradient.type === "solid") {
      return [gradient.color, gradient.color];
    }
    return gradient.colors;
  }, [gradient]);

  const setColors = useCallback(
    (colors: string[]) => {
      onColorChange?.({
        type: "gradient",
        colors,
        angle,
      });
    },
    [angle, onColorChange],
  );
  const setAngle = useCallback(
    (angle: number) => {
      onColorChange?.({
        type: "gradient",
        colors,
        angle,
      });
    },
    [colors, onColorChange],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between">
        <div
          className="absolute left-0 right-0 top-1/2 -z-10 h-2 -translate-y-1/2"
          style={{
            background: `linear-gradient(90deg, ${colors.join(", ")})`,
          }}
        ></div>
        {colors.map((color, i) => (
          <Fragment key={i}>
            <Popover>
              <PopoverTrigger>
                <div
                  style={{ backgroundColor: color }}
                  className="flex h-6 w-6 rounded-md border shadow-sm"
                  onMouseDown={(e) => {
                    if (e.button === 1 && colors.length > 2) {
                      setColors(colors.filter((_, j) => i !== j));
                    }
                  }}
                />
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start">
                <SolidPicker
                  color={color}
                  onColorChange={(color) => {
                    setColors(colors.map((c, j) => (i === j ? color : c)));
                  }}
                />
              </PopoverContent>
            </Popover>
            {colors.length <= 4 && i < colors.length - 1 && (
              <Button
                onClick={() => {
                  setColors([
                    ...colors.slice(0, i),
                    colors[i],
                    ...colors.slice(i),
                  ]);
                }}
                variant="outline"
                size="icon"
                className="h-5 w-5"
              >
                <PlusIcon />
              </Button>
            )}
          </Fragment>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Angle</Label>
          <p className="text-sm text-muted-foreground">{angle}deg</p>
        </div>
        <Slider
          value={[angle]}
          onValueChange={(values) => setAngle(values[0] ?? 90)}
          min={0}
          max={360}
          step={1}
        />
      </div>
    </div>
  );
}
