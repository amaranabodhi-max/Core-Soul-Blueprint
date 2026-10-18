import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";
import { Point } from "../data/layout";

// Тонкая золотая линия, которая прорисовывается от `from` к `to`.
// variant="parent" — плавная S-кривая от ребёнка вверх к родителю,
// variant="marriage" — дуга над карточками супругов.
export const Link: React.FC<{
  from: Point;
  to: Point;
  startFrame: number;
  drawFrames: number;
  variant?: "parent" | "marriage";
  glow?: number;
  highlight?: number;
}> = ({
  from,
  to,
  startFrame,
  drawFrames,
  variant = "parent",
  glow = 0,
  highlight = 0,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const progress = interpolate(
    frame,
    [startFrame, startFrame + drawFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.2, 1),
    },
  );

  const midY = (from.y + to.y) / 2;
  const d =
    variant === "parent"
      ? `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`
      : `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 150}, ${to.x} ${to.y}`;

  const color = highlight > 0 || glow > 0 ? COLORS.lightGold : COLORS.gold;
  const width = 2.5 + highlight * 2.5 + glow * 1.5;

  return (
    <g>
      {glow + highlight > 0 ? (
        <path
          d={d}
          pathLength={1}
          fill="none"
          stroke={COLORS.lightGold}
          strokeWidth={width * 5}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - progress}
          opacity={0.28 * Math.max(glow, highlight)}
          filter="url(#glow)"
        />
      ) : null}
      <path
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray="1 1"
        strokeDashoffset={1 - progress}
      />
    </g>
  );
};
