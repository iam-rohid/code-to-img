import * as React from "react";

export function useWindowSize() {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (typeof typeof window === "undefined") {
      return;
    }

    const onChange = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    onChange();

    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return { width, height };
}
