import { useState, useEffect, useRef } from "react";

interface LoadingStage {
  /** Time threshold in ms when this stage begins */
  startsAt: number;
  messages: string[];
}

const STAGES: LoadingStage[] = [
  {
    startsAt: 0,
    messages: [
      "Searching trusted health sources\u2026",
      "Scanning expert discussions\u2026",
    ],
  },
  {
    startsAt: 4000,
    messages: [
      "Retrieving relevant research\u2026",
      "Cross-referencing wellness resources\u2026",
    ],
  },
  {
    startsAt: 8000,
    messages: [
      "Analyzing the latest findings\u2026",
      "Gathering supporting evidence\u2026",
    ],
  },
  {
    startsAt: 12000,
    messages: [
      "Synthesizing your answer\u2026",
      "Weaving insights together\u2026",
      "Preparing your response\u2026",
    ],
  },
];

const MESSAGE_INTERVAL = 2500;

/**
 * Asymptotic progress curve: starts fast, decelerates toward 95%.
 * progress = 5 + 90 * (1 - e^(-t / tau))
 */
function computeProgress(elapsedMs: number): number {
  const tau = 12000;
  return Math.min(95, 5 + 90 * (1 - Math.exp(-elapsedMs / tau)));
}

function getStageIndex(elapsedMs: number): number {
  let idx = 0;
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (elapsedMs >= STAGES[i].startsAt) {
      idx = i;
      break;
    }
  }
  return idx;
}

export function useLoadingStage(): {
  currentMessage: string;
  progress: number;
} {
  const startTime = useRef(Date.now());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), MESSAGE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // Also update progress more frequently for smooth bar movement
  const [progress, setProgress] = useState(5);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress(computeProgress(Date.now() - startTime.current));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const elapsed = Date.now() - startTime.current;
  const stageIdx = getStageIndex(elapsed);
  const stage = STAGES[stageIdx];
  const msgIdx = tick % stage.messages.length;

  return {
    currentMessage: stage.messages[msgIdx],
    progress,
  };
}
