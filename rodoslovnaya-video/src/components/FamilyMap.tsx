import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, fontFamily } from "../theme";
import {
  DIRECT_ANCESTORS,
  EFIMIYA_MARRIAGES,
  ID,
  PEOPLE,
} from "../data/people";
import { CARD_H, WORLD, pos } from "../data/layout";
import {
  HEIGHT,
  MARRIAGE_START,
  SCENE_START as S,
  SCENE_END,
  SEGMENTS,
  WIDTH,
  appearAt,
  cameraAt,
} from "../timeline";
import { PersonCard } from "./PersonCard";
import { Link } from "./Link";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Вся карта рода в мировых координатах; камера двигает и масштабирует её.
export const FamilyMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const cam = cameraAt(sec);

  // «Вся карта»: линии светятся.
  const glow = interpolate(sec, [S.map + 0.8, S.map + 3], [0, 1], clamp);
  // Сцена Ефимии: подсвечиваем её браки и линию Веремей → Мария.
  const focus = interpolate(
    sec,
    [S.efimiya + 0.8, S.efimiya + 1.8, SCENE_END.efimiya, S.ascent + 1.2],
    [0, 1, 1, 0],
    clamp,
  );
  const focusIds = new Set([ID.efimiya, ID.yakov, ID.veremey, ID.maria]);
  const mapOpacity = interpolate(
    sec,
    [S.finale, S.finale + 1.6],
    [1, 0],
    clamp,
  );

  const edge = (id: string, side: "top" | "bottom", dx = 0) => ({
    x: pos(id).x + dx,
    y: pos(id).y + (side === "top" ? -CARD_H / 2 : CARD_H / 2),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: WORLD.width,
        height: WORLD.height,
        transformOrigin: "0 0",
        transform: `translate(${WIDTH / 2 - cam.x * cam.s}px, ${HEIGHT / 2 - cam.y * cam.s}px) scale(${cam.s})`,
        opacity: mapOpacity,
      }}
    >
      <svg
        width={WORLD.width}
        height={WORLD.height}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {SEGMENTS.map((seg, i) => (
          <Link
            key={`${seg.key}-${i}`}
            from={seg.from}
            to={seg.to}
            startFrame={Math.round(seg.start * fps)}
            drawFrames={Math.round(seg.drawSec * fps)}
            glow={glow}
            highlight={seg.veremeyMaria ? focus : 0}
          />
        ))}
        {EFIMIYA_MARRIAGES.map((m) => {
          const husbandLeft = pos(m.husband).x < pos(m.wife).x;
          return (
            <Link
              key={m.husband}
              variant="marriage"
              from={edge(m.husband, "top")}
              to={edge(m.wife, "top", husbandLeft ? -60 : 60)}
              startFrame={Math.round(MARRIAGE_START[m.husband] * fps)}
              drawFrames={Math.round(1.0 * fps)}
              glow={glow}
              highlight={focus * 0.6}
            />
          );
        })}
      </svg>

      {EFIMIYA_MARRIAGES.map((m) => {
        if (m.year === null) return null;
        const start = MARRIAGE_START[m.husband] + 0.6;
        const husbandLeft = pos(m.husband).x < pos(m.wife).x;
        const x =
          (pos(m.husband).x + pos(m.wife).x + (husbandLeft ? -60 : 60)) / 2;
        const y = pos(m.wife).y - CARD_H / 2 - 75;
        return (
          <div
            key={m.husband}
            style={{
              position: "absolute",
              left: x - 80,
              top: y - 62,
              width: 160,
              textAlign: "center",
              fontFamily,
              fontWeight: 700,
              fontSize: 40,
              color: COLORS.lightGold,
              opacity: interpolate(sec, [start, start + 0.6], [0, 1], clamp),
              translate: `0px ${interpolate(sec, [start, start + 0.8], [16, 0], clamp)}px`,
            }}
          >
            {m.year}
          </div>
        );
      })}

      {PEOPLE.map((p) => (
        <PersonCard
          key={p.id}
          person={p}
          kind={
            DIRECT_ANCESTORS.has(p.id)
              ? "ancestor"
              : p.gen === 0
                ? "self"
                : "other"
          }
          appearFrame={Math.round(appearAt(p.id) * fps)}
          x={pos(p.id).x}
          y={pos(p.id).y}
          glow={Math.max(glow * 0.5, focusIds.has(p.id) ? focus : 0)}
        />
      ))}
    </div>
  );
};
