import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TelemetryPoint } from "@/features/telemetry/telemetry.types";

interface TelemetryChartProps {
  title: string;
  unit: string;
  data: TelemetryPoint[];
  dataKey:
    | "heartRateBpm"
    | "breathsPerMin"
    | "stress";
  stroke: string;
  domain: [number, number];
  decimals?: number;
}

export function TelemetryChart({
  title,
  unit,
  data,
  dataKey,
  stroke,
  domain,
  decimals = 0,
}: TelemetryChartProps) {
  const latestValue =
    data.length > 0
      ? data[data.length - 1][dataKey]
      : 0;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-3">
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {title}
          </div>

          <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-[var(--text-primary)]">
            {latestValue.toFixed(decimals)}
            <span className="ml-1 text-[10px] font-medium uppercase text-[var(--text-muted)]">
              {unit}
            </span>
          </div>
        </div>

        <span className="text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          60s
        </span>
      </div>

      <div className="h-[150px] w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={data}
            margin={{
              top: 4,
              right: 4,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              stroke="rgba(210,235,225,0.07)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="elapsedMs"
              tickFormatter={(value) =>
                `${Math.floor(
                  Number(value) / 1000,
                )}s`
              }
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
              }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />

            <YAxis
              domain={domain}
              width={38}
              tick={{
                fill: "var(--text-muted)",
                fontSize: 9,
              }}
              axisLine={false}
              tickLine={false}
              tickCount={3}
            />

            <Tooltip
              contentStyle={{
                background:
                  "var(--surface-2)",
                border:
                  "1px solid var(--border-strong)",
                borderRadius: "8px",
                fontSize: "10px",
              }}
              labelFormatter={(value) =>
                `T+${Math.floor(
                  Number(value) / 1000,
                )}s`
              }
              formatter={(value) => [
                `${Number(value).toFixed(decimals)} ${unit}`,
                title,
              ]}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}