import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  getStaticFiles,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { COLORS, fontFamily } from "./theme";
import { TEXTS, SceneId } from "./texts";
import { FPS, SCENE_START } from "./timeline";
import { ID, byId } from "./data/people";
import { FamilyMap } from "./components/FamilyMap";
import { PersonCard } from "./components/PersonCard";
import { Scene } from "./components/Scene";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const caption = (id: SceneId) => TEXTS.scenes.find((s) => s.id === id)!.caption;

// 0–4 с: золотая точка раскрывается в карточку Ефимии.
const IntroOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const dot = interpolate(frame, [0, 0.7 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const dotFade = interpolate(frame, [0.9 * fps, 1.4 * fps], [1, 0], clamp);
  const leave = interpolate(
    frame,
    [durationInFrames - 0.8 * fps, durationInFrames],
    [0, 1],
    { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) },
  );
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: width / 2 - 14,
          top: height / 2 - 14,
          width: 28,
          height: 28,
          borderRadius: 14,
          background: COLORS.lightGold,
          boxShadow: `0 0 ${40 * dot}px ${12 * dot}px rgba(227,199,121,0.55)`,
          scale: String(dot),
          opacity: dotFade,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          scale: String(1.7 - 0.25 * leave),
          translate: `0px ${-260 * leave}px`,
          opacity: 1 - leave,
        }}
      >
        <PersonCard
          person={byId(ID.efimiya)}
          kind="ancestor"
          appearFrame={Math.round(0.8 * fps)}
          x={width / 2}
          y={height / 2}
          glow={1 - leave}
        />
      </div>
    </AbsoluteFill>
  );
};

// Подписи ветвей «Литва» / «Черкасщина».
const BranchLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const label = (text: string, delay: number, side: "left" | "right") => (
    <div
      style={{
        position: "absolute",
        bottom: 420,
        [side]: 70,
        fontFamily,
        fontStyle: "italic",
        fontSize: 46,
        color: COLORS.lightGold,
        opacity: interpolate(
          frame,
          [delay * fps, (delay + 0.8) * fps, 7.4 * fps, 8 * fps],
          [0, 1, 1, 0],
          clamp,
        ),
        textShadow: `0 0 30px ${COLORS.bg}`,
      }}
    >
      {text}
    </div>
  );
  return (
    <AbsoluteFill>
      {label(TEXTS.branchLeft, 2.4, "left")}
      {label(TEXTS.branchRight, 3.0, "right")}
    </AbsoluteFill>
  );
};

// 46–50 с: тёмный фон, золотая строка.
const FinaleOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0.9 * fps, 2.2 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const rule = interpolate(frame, [1.2 * fps, 2.6 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", gap: 34 }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 92,
          lineHeight: 1.1,
          textAlign: "center",
          padding: "0 80px",
          color: COLORS.lightGold,
          opacity: t,
          translate: `0px ${(1 - t) * 30}px`,
        }}
      >
        {caption("finale")}
      </div>
      <div
        style={{
          width: 520 * rule,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const hasMusic = () => {
  try {
    return getStaticFiles().some((f) => f.name === "music.mp3");
  } catch {
    return false;
  }
};

export const Rodoslovnaya: React.FC = () => {
  const frames = (sec: number) => Math.round(sec * FPS);
  const seq = (id: SceneId) => ({
    from: frames(SCENE_START[id]),
    durationInFrames: frames(
      TEXTS.scenes.find((s) => s.id === id)!.durationSec,
    ),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <FamilyMap />
      {/* Мягкая виньетка и затемнение под подписью. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 55%, transparent 55%, ${COLORS.bg}cc 100%), linear-gradient(180deg, ${COLORS.bg}ee 0%, ${COLORS.bg}00 28%)`,
        }}
      />

      <Sequence name="0 · Ефимия" {...seq("intro")}>
        <Scene caption={caption("intro")}>
          <IntroOverlay />
        </Scene>
      </Sequence>
      <Sequence name="1 · Рута и Мила" {...seq("sisters")}>
        <Scene caption={caption("sisters")} />
      </Sequence>
      <Sequence name="2 · Две ветви" {...seq("branches")}>
        <Scene caption={caption("branches")}>
          <BranchLabels />
        </Scene>
      </Sequence>
      <Sequence name="3 · Браки Ефимии" {...seq("efimiya")}>
        <Scene caption={caption("efimiya")} />
      </Sequence>
      <Sequence name="4 · Девять поколений" {...seq("ascent")}>
        <Scene caption={caption("ascent")} />
      </Sequence>
      <Sequence name="5 · Вся карта" {...seq("map")}>
        <Scene caption={caption("map")} />
      </Sequence>
      <Sequence name="6 · Финал" {...seq("finale")}>
        <Scene
          caption={caption("finale")}
          captionPosition="none"
          fadeOut={false}
        >
          <FinaleOverlay />
        </Scene>
      </Sequence>

      {hasMusic() ? (
        <Audio src={staticFile("music.mp3")} volume={0.35} loop />
      ) : null}
    </AbsoluteFill>
  );
};
