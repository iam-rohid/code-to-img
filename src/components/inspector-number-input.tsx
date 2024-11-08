import { Input } from "@/components/ui/input";
import {
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function InspectorNumberInput({
  icon,
  onValueChange,
  value,
}: {
  value: number;
  onValueChange: (value: number) => void;
  icon: ReactNode;
}) {
  const [text, setText] = useState(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    if (isFocused || isResizing) {
      return;
    }
    if (text !== String(value)) {
      console.log("Settings Value");
      setText(String(value));
    }
  }, [isFocused, isResizing, text, value]);

  const handleCommitValue = useCallback(() => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue)) {
      onValueChange(newValue);
      setText(String(newValue));
    } else {
      setText(String(value));
    }
    ref.current?.blur();
  }, [onValueChange, text, value]);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setStartX(e.clientX);
    setIsResizing(true);
    document.documentElement.classList.add("cursor-col-resize", "select-none");
  }, []);

  const handleMouseUp = useCallback((e: globalThis.MouseEvent) => {
    e.preventDefault();
    setIsResizing(false);
    document.documentElement.classList.remove(
      "cursor-col-resize",
      "select-none",
    );
  }, []);

  const handleMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      const currentX = e.clientX;
      const newValue = Math.floor(value + (currentX - startX));
      onValueChange(newValue);
      setText(String(newValue));
      setStartX(currentX);
    },
    [onValueChange, startX, value],
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

  useEffect(() => {}, []);

  return (
    <fieldset className="relative">
      <Input
        ref={ref}
        value={text}
        onChange={(e) => {
          setText(e.currentTarget.value);
        }}
        onFocus={() => setIsFocused(true)}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleCommitValue();
            e.preventDefault();
          }
        }}
        onBlur={() => {
          handleCommitValue();
          setIsFocused(false);
        }}
        className="pl-10"
      />
      <div
        onMouseDown={handleMouseDown}
        className="absolute bottom-0 left-0 top-0 flex w-10 cursor-col-resize items-center justify-center text-center text-sm text-muted-foreground"
      >
        {icon}
      </div>
    </fieldset>
  );
}
