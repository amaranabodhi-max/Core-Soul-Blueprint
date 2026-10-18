import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../theme";
import { TEXTS } from "../texts";
import { Person, formatDates } from "../data/people";
import { CARD_H, CARD_W } from "../data/layout";

export type CardKind = "self" | "ancestor" | "other";

export const PersonCard: React.FC<{
  person: Person;
  kind: CardKind;
  appearFrame: number;
  x: number;
  y: number;
  glow?: number;
}> = ({ person, kind, appearFrame, x, y, glow = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearFrame) return null;

  // Мягкое «всплытие» снизу.
  const rise = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 90 },
  });
  const fade = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const dates = formatDates(person, TEXTS);

  const border =
    kind === "ancestor"
      ? `6px double ${COLORS.gold}`
      : kind === "self"
        ? `2px solid ${COLORS.lightGold}`
        : `2px solid ${person.color}`;

  return (
    <div
      style={{
        position: "absolute",
        left: x - CARD_W / 2,
        top: y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        boxSizing: "border-box",
        borderRadius: 22,
        border,
        // Цвет линии рода с прозрачностью 80% поверх тёмного фона,
        // чтобы линии не просвечивали сквозь карточку.
        background: `linear-gradient(${person.color}33, ${person.color}33), ${COLORS.bg}`,
        boxShadow:
          glow > 0
            ? `0 0 ${24 + glow * 30}px rgba(227, 199, 121, ${0.35 * glow})`
            : "0 10px 30px rgba(0,0,0,0.35)",
        opacity: fade,
        translate: `0px ${(1 - rise) * 70}px`,
        scale: String(0.9 + 0.1 * rise),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "10px 16px",
        gap: 6,
        fontFamily,
        color: COLORS.cream,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 27, lineHeight: 1.12 }}>
        {person.name}
      </div>
      {dates ? (
        <div
          style={{
            fontSize: 21,
            lineHeight: 1.15,
            color: COLORS.lightGold,
            fontVariantNumeric: "lining-nums",
          }}
        >
          {dates}
        </div>
      ) : null}
      {person.place ? (
        <div
          style={{
            fontSize: 17,
            fontStyle: "italic",
            opacity: 0.75,
            lineHeight: 1.1,
          }}
        >
          {person.place}
        </div>
      ) : null}
    </div>
  );
};
