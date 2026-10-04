# Race Control Dashboard

## 1. Project Overview

This project is a React + TypeScript race-control dashboard for a
simulated motorsport session.

The application runs a local race simulation and exposes the simulated
state through an operator-style dashboard. The tester should be able to
start the application, observe the race progressing automatically,
select drivers, inspect telemetry, interact with the tyre/car
visualization, and review weather and race events.

The project is intentionally self-contained and uses simulated data. No
external motorsport data provider is required to run the application.

------------------------------------------------------------------------

## 2. Prerequisites

Install the following before running the project:

-   Node.js
-   npm

Verify the installation:

``` bash
node --version
npm --version
```

------------------------------------------------------------------------

## 3. Installation

From the project root:

``` bash
npm install
```

Wait for dependency installation to complete successfully.

------------------------------------------------------------------------

## 4. Start the Application

Run the development server:

``` bash
npm run dev
```

Vite will print the local development URL in the terminal.

Open the displayed URL in a browser.

### Expected result

The Race Control dashboard should load and the race simulation should
start automatically.

The application should not require a login, external API key, or
external data source.

------------------------------------------------------------------------

## 5. How the Application Works

The application has two main types of state:

### Simulation state

Simulation state represents the current race session:

-   Circuit
-   Drivers
-   Driver race state
-   Car telemetry
-   Driver physiology
-   Telemetry history
-   Weather
-   Race events

The simulation engine continuously updates this state.

### UI state

UI state represents user interaction:

-   Selected driver
-   Focused tyre

UI state is maintained separately so that interaction state does not
have to be mixed with the simulation engine.

------------------------------------------------------------------------

## 6. Application Startup Flow

When `App.tsx` mounts:

``` text
App mounts
   ↓
startSimulation()
   ↓
Simulation loop begins
   ↓
Simulation state changes continuously
   ↓
Zustand store publishes updated state
   ↓
React components re-render
```

When the application is unmounted:

``` text
App unmounts
   ↓
stopSimulation()
   ↓
Simulation loop stops
```

This prevents the simulation runner from continuing after the dashboard
is removed.

------------------------------------------------------------------------

## 7. Main Dashboard Areas

The dashboard is organized into the following functional areas.

### 7.1 Header

The header contains:

-   Live status
-   Simulation elapsed time
-   Circuit name and country
-   Driver selector

The driver selector allows the tester to change the active driver.

------------------------------------------------------------------------

### 7.2 Race Status

The Race Status panel displays information for the currently selected
driver:

-   Position
-   Lap
-   Top speed
-   Best lap
-   Lap progress

### Test procedure

1.  Start the application.
2.  Note the selected driver.
3.  Observe the lap/progress values.
4.  Allow the simulation to run.
5.  Confirm that simulation values continue to change.

------------------------------------------------------------------------

### 7.3 Car / Tyre Telemetry

The Car Systems section provides the interactive tyre/car visualization.

Four tyres are represented:

``` text
FL = Front Left
FR = Front Right
RL = Rear Left
RR = Rear Right
```

Each tyre exposes:

-   Temperature
-   Pressure

### Test procedure

1.  Locate the four tyre areas/cards.
2.  Click `FL`.
3.  Confirm that FL becomes the focused tyre.
4.  Click `FR`.
5.  Confirm that FR becomes focused and FL is no longer focused.
6.  Repeat for `RL` and `RR`.
7.  Click the currently focused tyre again.
8.  Confirm that tyre focus is cleared.

------------------------------------------------------------------------

## 8. Driver Selection

A driver can be selected from the dashboard driver selector and from the
interactive track map.

### Test procedure --- header

1.  Click a different driver in the header.
2.  Confirm that the selected driver changes.
3.  Confirm that Race Status changes to the new driver.
4.  Confirm that Driver Telemetry changes to the new driver.
5.  Confirm that vehicle/car telemetry corresponds to the selected
    driver.

### Test procedure --- track map

1.  Scroll to the circuit map.
2.  Locate the moving cars.
3.  Click a car.
4.  Confirm that the corresponding driver becomes selected.
5.  Confirm that the selected car receives the visual
    selection/highlight state.
6.  Confirm that the dashboard telemetry changes accordingly.

------------------------------------------------------------------------

## 9. Driver Telemetry

The Driver Telemetry section displays simulated driver physiology.

Current telemetry includes:

-   Heart rate
-   Breathing rate
-   Stress

Historical telemetry is retained and displayed as charts.

### Test procedure

1.  Start the simulation.
2.  Observe the driver telemetry charts.
3.  Allow the application to run for several seconds.
4.  Confirm that new telemetry points appear over time.
5.  Select another driver.
6.  Confirm that the displayed telemetry corresponds to the newly
    selected driver.

------------------------------------------------------------------------

## 10. Telemetry History

Telemetry points contain:

``` ts
interface TelemetryPoint {
  timestampMs: number;
  elapsedMs: number;
  heartRateBpm: number;
  breathsPerMin: number;
  stress: number;
}
```

The simulation maintains a bounded history rather than continuously
accumulating unlimited chart data.

This keeps the live dashboard responsive during a long-running
simulation.

------------------------------------------------------------------------

## 11. Power Unit / Car Telemetry

The Power Unit section displays the selected car's:

-   RPM
-   Engine temperature
-   Fuel
-   ERS

### Test procedure

1.  Select a driver.
2.  Locate the Power Unit / Car Telemetry section.
3.  Confirm all four metrics are displayed.
4.  Wait while the simulation runs.
5.  Confirm that the values update.
6.  Select another driver and confirm that the values change to the
    selected car.

------------------------------------------------------------------------

## 12. Track Map

The circuit section displays the Hockenheim track.

The map includes simulated cars moving along the racing line.

Cars are positioned and rotated according to their simulated track
progress.

### Test procedure

1.  Locate the Hockenheim Track Map.
2.  Observe the cars.
3.  Wait for the simulation to advance.
4.  Confirm that cars move.
5.  Confirm that their orientation changes around the circuit.
6.  Click a car and verify driver selection.
7.  Confirm that the selected driver is visually highlighted.

------------------------------------------------------------------------

## 13. Weather / Track Conditions

The Weather section displays simulated track conditions:

-   Air temperature
-   Humidity
-   Wind speed
-   Atmospheric pressure
-   Cloud cover

### Test procedure

1.  Locate Track Conditions.
2.  Confirm that all weather metrics are displayed.
3.  Allow the simulation to continue.
4.  Observe whether the displayed simulation values update.

------------------------------------------------------------------------

## 14. Live Event Stream

The Race Control section displays recent simulation events.

Events are shown with a severity indicator.

Supported severity categories include:

-   Informational
-   Caution
-   Critical

The event stream shows recent events and their timestamps.

### Test procedure

1.  Locate the Live Event Stream.
2.  Confirm that events are displayed.
3.  Check that each event has a severity indicator.
4.  Check that event timestamps are displayed.
5.  Allow the simulation to continue and observe new simulation events.

------------------------------------------------------------------------

## 15. Driver Switching and State Reset

Selecting a different driver changes the active dashboard context.

The UI store intentionally resets tyre focus when the driver changes.

Expected behavior:

``` text
Driver A selected
      ↓
FL focused
      ↓
Select Driver B
      ↓
Driver B becomes selected
      ↓
Tyre focus becomes null
```

### Test procedure

1.  Select Driver A.
2.  Focus one tyre.
3.  Select Driver B.
4.  Confirm that Driver B is selected.
5.  Confirm that the previously focused tyre is no longer active.

------------------------------------------------------------------------

## 16. Expected Runtime Behavior

After starting the application, the tester should see a continuously
running simulation.

The following should happen without manually refreshing the browser:

-   Simulation elapsed time increases.
-   Driver race state progresses.
-   Cars move around the circuit.
-   Telemetry changes.
-   Telemetry charts receive new data.
-   Vehicle telemetry changes.
-   Weather values are available.
-   Race events are available.
-   Driver selection changes the dashboard context.

------------------------------------------------------------------------

## 17. Project Architecture

The project separates simulation logic, application state, feature UI,
and reusable UI components.

``` text
src/
├── app/
│   └── AppShell.tsx
│
├── components/
│   ├── metric/
│   │   └── Metric.tsx
│   ├── panel/
│   │   └── Panel.tsx
│   └── status/
│       └── StatusBadge.tsx
│
├── data/
│   └── create-initial-simulation.ts
│
├── features/
│   ├── car/
│   │   └── CarTelemetryPanel.tsx
│   ├── driver/
│   │   ├── driver.types.ts
│   │   └── components/
│   │       └── VehicleTelemetryPanel.tsx
│   ├── events/
│   ├── race/
│   │   └── components/
│   │       └── TrackMap.tsx
│   ├── telemetry/
│   │   ├── telemetry.types.ts
│   │   └── components/
│   │       ├── DriverTelemetryPanel.tsx
│   │       └── TelemetryChart.tsx
│   └── weather/
│
├── simulation/
│   ├── simulation.engine.ts
│   ├── simulation.runner.ts
│   └── simulation.types.ts
│
├── state/
│   ├── simulation.store.ts
│   └── ui.store.ts
│
└── App.tsx
```

------------------------------------------------------------------------

## 18. Important Files

### `src/App.tsx`

Application composition and dashboard layout.

It:

-   Starts/stops the simulation.
-   Reads simulation state.
-   Reads selected-driver UI state.
-   Connects dashboard sections to the stores.
-   Renders the major dashboard sections.

### `src/simulation/simulation.engine.ts`

Contains the simulation update logic.

This is where the simulated race state is advanced.

### `src/simulation/simulation.runner.ts`

Owns the continuous simulation loop.

### `src/simulation/simulation.types.ts`

Contains simulation-related TypeScript types.

### `src/data/create-initial-simulation.ts`

Creates the initial simulation state.

### `src/state/simulation.store.ts`

Zustand store for simulation state.

### `src/state/ui.store.ts`

Zustand store for user-interface state.

Current UI state includes:

``` ts
selectedDriverId: string;
focusedTyre: "fl" | "fr" | "rl" | "rr" | null;
```

### `src/features/race/components/TrackMap.tsx`

Interactive Hockenheim circuit visualization and driver selection.

### `src/features/telemetry/components/TelemetryChart.tsx`

Reusable telemetry chart presentation.

### `src/features/telemetry/components/DriverTelemetryPanel.tsx`

Driver physiology telemetry and charts.

### `src/features/car/CarTelemetryPanel.tsx`

Interactive car and tyre telemetry presentation.

------------------------------------------------------------------------