import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// Одна строка раскадровки: подпись сцены и её собственные элементы
// поверх карты. Время внутри — локальное (0 = начало сцены).
export const Scene: React.FC<{
  caption: string;
  captionPosition?: "top" | "none";
  fadeOut?: boolean;
  children?: React.ReactNode;
}> = ({ caption, captionPosition = "top", fadeOut = true, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    fadeOut
      ? [0.25 * fps, 0.9 * fps, durationInFrames - 0.5 * fps, durationInFrames]
      : [0.25 * fps, 0.9 * fps, durationInFrames - 1, durationInFrames],
    [0, 1, 1, fadeOut ? 0 : 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.33, 0, 0.2, 1),
    },
  );

  return (
    <AbsoluteFill>
      {children}
      {captionPosition === "top" ? (
        <AbsoluteFill
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 230,
            paddingLeft: 80,
            paddingRight: 80,
          }}
        >
          <div
            style={{
              opacity,
              translate: `0px ${interpolate(frame, [0.25 * fps, 1.1 * fps], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
              fontFamily,
              fontSize: 64,
              lineHeight: 1.18,
              fontWeight: 700,
              textAlign: "center",
              color: COLORS.cream,
              textShadow: `0 2px 18px ${COLORS.bg}, 0 0 40px ${COLORS.bg}`,
            }}
          >
            {caption}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
