import { CSSProperties } from "react";

import { iColor } from "../validator/color";
import { iPadding } from "../validator/elements/shared";

export function getPaddingStyle(padding: iPadding): CSSProperties {
  return {
    paddingLeft: padding.left,
    paddingRight: padding.right,
    paddingTop: padding.top,
    paddingBottom: padding.bottom,
  };
}

export function getBackgroundStyle(color: iColor): CSSProperties {
  switch (color.type) {
    case "solid":
      return { backgroundColor: color.color };
    case "gradient":
      return {
        backgroundImage: `linear-gradient(${color.angle}deg, ${color.colors.map((colorHash, i) => `${colorHash} ${(i * 100) / (color.colors.length - 1)}%`).join(", ")}`,
      };

    default:
      return {};
  }
}
