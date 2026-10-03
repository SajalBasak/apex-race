import { useSimulationStore } from "@/state/simulation.store";
import { stepSimulation } from "@/simulation/simulation.engine";

let intervalId: number | null = null;

const TICK_MS = 1000;

export function startSimulation() {
  if (intervalId !== null) {
    return;
  }

  intervalId = window.setInterval(() => {
    const { state, setState } =
      useSimulationStore.getState();

    setState(
      stepSimulation(
        state,
        TICK_MS,
      ),
    );
  }, TICK_MS);
}

export function stopSimulation() {
  if (intervalId === null) {
    return;
  }

  window.clearInterval(intervalId);
  intervalId = null;
}