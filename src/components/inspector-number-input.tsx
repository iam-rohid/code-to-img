import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function InspectorNumberInput({
  icon,
  onValueChange,
  value,
  max,
  min,
  id,
  disabled,
  className,
}: {
  id?: string;
  value: number;
  onValueChange?: (value: number) => void;
  icon: ReactNode;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}) {
  const [text, setText] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);

  const clampValue = useCallback(
    (value: number) => {
      if (min !== undefined) {
        value = Math.max(value, min);
      }
      if (max !== undefined) {
        value = Math.min(value, max);
      }
      return value;
    },
    [max, min],
  );

  const handleCommitValue = useCallback(() => {
    let newValue = parseFloat(text);
    if (!isNaN(newValue)) {
      newValue = clampValue(newValue);
      onValueChange?.(newValue);
      setText(String(newValue));
    } else {
      setText(String(value));
    }
    ref.current?.blur();
  }, [clampValue, onValueChange, text, value]);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    setStartX(e.clientX);
    setIsResizing(true);
    document.documentElement.classList.add("cursor-col-resize", "select-none");
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.documentElement.classList.remove(
      "cursor-col-resize",
      "select-none",
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      const currentX = e.clientX;
      let newValue = Math.floor((value ?? 0) + (currentX - startX));
      newValue = clampValue(newValue);
      onValueChange?.(newValue);
      setText(String(newValue));
      setStartX(currentX);
    },
    [clampValue, onValueChange, startX, value],
  );

  useEffect(() => {
    if (!isResizing) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isResizing]);

  useEffect(() => {
    if (isFocused || isResizing) {
      return;
    }
    if (text === String(value)) {
      return;
    }
    const timeout = setTimeout(() => {
      setText(String(value));
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isFocused, isResizing, text, value]);

  return (
    <fieldset className="relative">
      <Input
        id={id}
        ref={ref}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
        }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleCommitValue();
          }
        }}
        onBlur={() => {
          handleCommitValue();
          setIsFocused(false);
        }}
        className={cn("pl-10", className)}
        disabled={disabled}
      />
      <div
        onMouseDown={handleMouseDown}
        aria-disabled={disabled}
        className={cn(
          "absolute bottom-0 left-0 top-0 flex w-10 cursor-col-resize items-center justify-center text-center text-sm text-muted-foreground [&>svg]:h-5 [&>svg]:w-5",
          {
            "pointer-events-none": disabled,
          },
        )}
      >
        {icon}
      </div>
    </fieldset>
  );
}
