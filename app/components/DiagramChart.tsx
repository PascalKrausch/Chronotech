"use client";

import {
  LineChart,
  BarChart,
  PieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Diagram } from "@/lib/types";

const CHART_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#6366f1", // indigo-500
];

interface DiagramChartProps {
  block: Diagram;
}

export default function DiagramChart({ block }: DiagramChartProps) {
  // Prüfe ob Daten vorhanden sind
  if (block.labels.length === 0 || block.series.length === 0) {
    return (
      <div className="my-6 p-8 border-2 border-dashed border-stone-300 rounded-lg bg-stone-50 text-center">
        <p className="text-sm text-stone-600">
          📊 Diagramm ist leer. Bitte Labels und Datenserien hinzufügen.
        </p>
      </div>
    );
  }

  // Transformiere Daten für Recharts Format
  // Labels werden zu den X-Achsen-Werten, Series werden zu den Datenreihen
  const chartData = block.labels.map((label, i) => {
    const dataPoint: Record<string, any> = { name: label };

    // Füge jeden Series-Datenpunkt hinzu
    block.series.forEach((series) => {
      dataPoint[series.name] = series.values[i] ?? 0;
    });

    return dataPoint;
  });

  const renderChart = () => {
    switch (block.chartType) {
      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#78716c" }}
              tickLine={{ stroke: "#d6d3d1" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#78716c" }} tickLine={{ stroke: "#d6d3d1" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fafaf8",
                border: "1px solid #e7e5e4",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#292524" }}
            />
            <Legend />
            {block.series.map((series, idx) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS[idx % CHART_COLORS.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#78716c" }}
              tickLine={{ stroke: "#d6d3d1" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#78716c" }} tickLine={{ stroke: "#d6d3d1" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fafaf8",
                border: "1px solid #e7e5e4",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#292524" }}
            />
            <Legend />
            {block.series.map((series, idx) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        // Für Pie-Charts verwenden wir nur die erste Serie
        const firstSeriesData = block.labels.map((label, i) => ({
          name: label,
          value: block.series[0]?.values[i] ?? 0,
        }));

        return (
          <PieChart>
            <Pie
              data={firstSeriesData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {firstSeriesData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fafaf8",
                border: "1px solid #e7e5e4",
                borderRadius: "6px",
              }}
              labelStyle={{ color: "#292524" }}
            />
            <Legend />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-6 p-6 border rounded-lg bg-white border-stone-200 shadow-sm">
      {block.title && (
        <h3 className="text-lg font-semibold text-stone-800 mb-4">
          {block.title}
        </h3>
      )}
      <div className="w-full" style={{ height: block.chartType === "pie" ? 400 : 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
