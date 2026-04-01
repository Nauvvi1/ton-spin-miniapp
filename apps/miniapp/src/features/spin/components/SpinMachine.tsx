import { useEffect, useMemo, useRef, useState } from "react";
import { BASE_REEL_SEQUENCE, REEL_ITEM_HEIGHT } from "../../../../../../shared/reel";
import { PrizeTile } from "./PrizeTile";
import { defaultStartIndex, getTranslateYForIndex, normalizeVirtualIndex, virtualReel } from "../utils/reel";
import { softImpact, successHaptic } from "../../../lib/telegram";

interface SpinMachineProps {
  spinTargetIndex: number | null;
  isSpinning: boolean;
  onSpinAnimationEnd: () => void;
}

const ANIMATION_MS = 4200;

export function SpinMachine({
  spinTargetIndex,
  isSpinning,
  onSpinAnimationEnd
}: SpinMachineProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultStartIndex);
  const [transitionMs, setTransitionMs] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const activeCenterIndex = currentIndex;

  const translateY = useMemo(() => getTranslateYForIndex(currentIndex), [currentIndex]);

  useEffect(() => {
    if (!isSpinning || spinTargetIndex === null) {
      return;
    }

    setTransitionMs(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionMs(ANIMATION_MS);
        setCurrentIndex(spinTargetIndex);
        softImpact();
      });
    });
  }, [isSpinning, spinTargetIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    function handleTransitionEnd(event: TransitionEvent) {
      if (event.propertyName !== "transform" || !isSpinning) {
        return;
      }

      const normalized = normalizeVirtualIndex(spinTargetIndex ?? currentIndex);
      setTransitionMs(0);
      setCurrentIndex(normalized);
      successHaptic();
      onSpinAnimationEnd();
    }

    track.addEventListener("transitionend", handleTransitionEnd);
    return () => track.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentIndex, isSpinning, onSpinAnimationEnd, spinTargetIndex]);

  return (
    <div className={`reel-shell ${isSpinning ? "is-spinning" : ""}`}>
      <div className="reel-focus-frame" />

      <div
        ref={trackRef}
        className="reel-track"
        style={{
          transform: `translate3d(0, -${translateY}px, 0)`,
          transitionDuration: `${transitionMs}ms`
        }}
      >
        {virtualReel.map((prizeId, index) => (
          <div
            key={`${prizeId}-${index}`}
            className={`reel-track__row ${
              index === activeCenterIndex ? "is-active-row" : ""
            } ${index === spinTargetIndex ? "is-target-row" : ""}`}
            style={{ height: `${REEL_ITEM_HEIGHT}px` }}
          >
            <PrizeTile
              prizeId={prizeId}
              isCenter={index === activeCenterIndex}
              isWinningTarget={index === spinTargetIndex}
            />
          </div>
        ))}
      </div>

      <div className="reel-shade reel-shade--top" />
      <div className="reel-shade reel-shade--bottom" />

      <div className="reel-side-marker reel-side-marker--left" />
      <div className="reel-side-marker reel-side-marker--right" />

      <div className="reel-side-summary">
        <span>{BASE_REEL_SEQUENCE.length} типов плиток</span>
        <span>серверный RNG</span>
      </div>
    </div>
  );
}
