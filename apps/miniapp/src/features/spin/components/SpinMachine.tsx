import { useEffect, useMemo, useRef, useState } from "react";
import { REEL_ITEM_HEIGHT } from "../../../../../../shared/reel";
import { PrizeTile } from "./PrizeTile";
import {
  defaultStartIndex,
  normalizeFloatVirtualIndex,
  normalizeVirtualIndex,
  reelCycleLength,
  virtualReel
} from "../utils/reel";
import { softImpact, successHaptic } from "../../../lib/telegram";

interface SpinMachineProps {
  spinTargetIndex: number | null;
  isSpinning: boolean;
  onSpinAnimationEnd: () => void;
}

const LOOP_SPEED_TILES_PER_MS = 0.0105;
const MIN_LOOP_MS = 900;
const SETTLE_DURATION_MS = 3400;
const EXTRA_SETTLE_CYCLES = 2;

const SHOWCASE_BIG_PRIZE_IDS = ["ton-5", "ton-10", "ton-20", "ton-50"];

function easeOutQuint(progress: number): number {
  return 1 - Math.pow(1 - progress, 5);
}

function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function findNearestPrizeIndex(reel: string[], prizeId: string, fromIndex: number): number {
  const matches: number[] = [];

  reel.forEach((id, index) => {
    if (id === prizeId) {
      matches.push(index);
    }
  });

  if (matches.length === 0) {
    return fromIndex;
  }

  let bestIndex = matches[0];
  let bestDistance = Math.abs(matches[0] - fromIndex);

  for (let i = 1; i < matches.length; i += 1) {
    const distance = Math.abs(matches[i] - fromIndex);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = matches[i];
    }
  }

  return bestIndex;
}

function buildIdleReel(reel: string[], centerPrizeId: string, centerIndex: number): string[] {
  const shuffled = shuffleArray(reel);

  const existingIndex = shuffled.findIndex((item) => item === centerPrizeId);

  if (existingIndex >= 0) {
    [shuffled[centerIndex], shuffled[existingIndex]] = [shuffled[existingIndex], shuffled[centerIndex]];
  } else {
    shuffled[centerIndex] = centerPrizeId;
  }

  return shuffled;
}

export function SpinMachine({
  spinTargetIndex,
  isSpinning,
  onSpinAnimationEnd
}: SpinMachineProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const currentIndexRef = useRef<number>(defaultStartIndex);
  const loopStartedAtRef = useRef<number | null>(null);
  const lastFrameAtRef = useRef<number | null>(null);
  const settleStartedAtRef = useRef<number | null>(null);
  const settleFromIndexRef = useRef<number>(defaultStartIndex);
  const settleTargetIndexRef = useRef<number | null>(null);
  const modeRef = useRef<"idle" | "loop" | "settle">("idle");
  const hasSpunRef = useRef(false);

  const [shellHeight, setShellHeight] = useState(0);

  const idleCenterPrizeId = useMemo(() => {
    const availableBigPrizes = SHOWCASE_BIG_PRIZE_IDS.filter((id) => virtualReel.includes(id));

    if (availableBigPrizes.length === 0) {
      return virtualReel[defaultStartIndex];
    }

    return availableBigPrizes[Math.floor(Math.random() * availableBigPrizes.length)];
  }, []);

  const idleReel = useMemo(() => {
    return buildIdleReel(virtualReel, idleCenterPrizeId, defaultStartIndex);
  }, [idleCenterPrizeId]);

  const displayedReel = !hasSpunRef.current && !isSpinning ? idleReel : virtualReel;

  const getTranslateYForIndex = (index: number) => {
    const centerOffset = shellHeight / 2 - REEL_ITEM_HEIGHT / 2;
    return centerOffset - index * REEL_ITEM_HEIGHT;
  };

  const applyTransform = (index: number) => {
    const track = trackRef.current;
    if (!track || shellHeight <= 0) {
      return;
    }

    track.style.transform = `translate3d(0, ${getTranslateYForIndex(index)}px, 0)`;
  };

  const stopAnimation = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const updateSize = () => {
      setShellHeight(shell.clientHeight);
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(shell);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (shellHeight <= 0) {
      return;
    }

    if (!hasSpunRef.current && !isSpinning) {
      currentIndexRef.current = defaultStartIndex;
      applyTransform(defaultStartIndex);
      return;
    }

    applyTransform(currentIndexRef.current);
  }, [shellHeight, isSpinning]);

  useEffect(() => {
    if (shellHeight <= 0) {
      return;
    }

    if (!isSpinning) {
      stopAnimation();

      if (modeRef.current !== "idle") {
        currentIndexRef.current = normalizeFloatVirtualIndex(currentIndexRef.current);
        applyTransform(currentIndexRef.current);
      }

      modeRef.current = "idle";
      loopStartedAtRef.current = null;
      lastFrameAtRef.current = null;
      settleStartedAtRef.current = null;
      settleTargetIndexRef.current = null;

      return;
    }

    if (modeRef.current === "idle") {
      if (!hasSpunRef.current) {
        const startingIndexInRealReel = findNearestPrizeIndex(
          virtualReel,
          idleCenterPrizeId,
          defaultStartIndex
        );

        currentIndexRef.current = startingIndexInRealReel;
        applyTransform(startingIndexInRealReel);
      }

      hasSpunRef.current = true;
      modeRef.current = "loop";
      loopStartedAtRef.current = null;
      lastFrameAtRef.current = null;
      settleStartedAtRef.current = null;
      settleTargetIndexRef.current = null;
      softImpact();
    }

    const frame = (timestamp: number) => {
      if (loopStartedAtRef.current === null) {
        loopStartedAtRef.current = timestamp;
      }

      if (lastFrameAtRef.current === null) {
        lastFrameAtRef.current = timestamp;
      }

      const delta = timestamp - lastFrameAtRef.current;
      lastFrameAtRef.current = timestamp;

      if (modeRef.current === "loop") {
        currentIndexRef.current += delta * LOOP_SPEED_TILES_PER_MS;

        if (currentIndexRef.current > virtualReel.length - reelCycleLength * 2) {
          currentIndexRef.current = normalizeFloatVirtualIndex(currentIndexRef.current);
        }

        applyTransform(currentIndexRef.current);

        const loopElapsed = timestamp - loopStartedAtRef.current;
        if (spinTargetIndex !== null && loopElapsed >= MIN_LOOP_MS) {
          modeRef.current = "settle";
          settleStartedAtRef.current = timestamp;
          settleFromIndexRef.current = currentIndexRef.current;

          let targetIndex = spinTargetIndex;

          while (targetIndex <= settleFromIndexRef.current + reelCycleLength * EXTRA_SETTLE_CYCLES) {
            targetIndex += reelCycleLength;
          }

          settleTargetIndexRef.current = targetIndex;
        }
      } else if (
        modeRef.current === "settle" &&
        settleStartedAtRef.current !== null &&
        settleTargetIndexRef.current !== null
      ) {
        const settleElapsed = timestamp - settleStartedAtRef.current;
        const progress = Math.min(settleElapsed / SETTLE_DURATION_MS, 1);
        const eased = easeOutQuint(progress);

        const nextIndex =
          settleFromIndexRef.current +
          (settleTargetIndexRef.current - settleFromIndexRef.current) * eased;

        currentIndexRef.current = nextIndex;
        applyTransform(nextIndex);

        if (progress >= 1) {
          stopAnimation();
          currentIndexRef.current = normalizeVirtualIndex(settleTargetIndexRef.current);
          applyTransform(currentIndexRef.current);
          modeRef.current = "idle";
          lastFrameAtRef.current = null;
          settleStartedAtRef.current = null;
          settleTargetIndexRef.current = null;
          successHaptic();
          onSpinAnimationEnd();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(frame);
    };

    stopAnimation();
    animationFrameRef.current = requestAnimationFrame(frame);

    return stopAnimation;
  }, [isSpinning, onSpinAnimationEnd, shellHeight, spinTargetIndex, idleCenterPrizeId]);

  return (
    <div ref={shellRef} className={`reel-shell ${isSpinning ? "is-spinning" : ""}`}>
      <div className="reel-focus-frame" />

      <div ref={trackRef} className="reel-track">
        {displayedReel.map((prizeId, index) => (
          <div
            key={`${prizeId}-${index}`}
            className={`reel-track__row ${index === spinTargetIndex ? "is-target-row" : ""}`}
            style={{ height: `${REEL_ITEM_HEIGHT}px` }}
          >
            <PrizeTile prizeId={prizeId} isWinningTarget={index === spinTargetIndex} />
          </div>
        ))}
      </div>

      <div className="reel-shade reel-shade--top" />
      <div className="reel-shade reel-shade--bottom" />

      <div className="reel-side-marker reel-side-marker--left" />
      <div className="reel-side-marker reel-side-marker--right" />

      <div className="reel-shell__dust" />
      <div className="reel-shell__glow" />
      <div className="reel-shell__ambient" />
    </div>
  );
}