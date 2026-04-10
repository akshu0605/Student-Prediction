import { motion } from "motion/react";

interface DataPoint {
  id: string;
  subject: string;
  score: number;
}

interface BarChartProps {
  data: DataPoint[];
}

export function BarChart({ data }: BarChartProps) {
  const maxScore = 100;
  const width = 800;
  const height = 450;
  const paddingLeft = 80;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 80;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate bar positioning
  const barCount = data.length;
  const totalBarWidth = chartWidth / barCount;
  const barWidth = totalBarWidth * 0.6;
  const barGap = totalBarWidth * 0.4;

  // Y-axis base (where bars start)
  const yAxisBase = paddingTop + chartHeight;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((value) => {
          const yPos = yAxisBase - (value / maxScore) * chartHeight;
          return (
            <g key={`y-${value}`}>
              <text
                x={paddingLeft - 25}
                y={yPos}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#6B7280"
                fontSize="16"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Y-axis line */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={yAxisBase}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* X-axis line */}
        <line
          x1={paddingLeft}
          y1={yAxisBase}
          x2={width - paddingRight}
          y2={yAxisBase}
          stroke="#374151"
          strokeWidth="2"
        />

        {/* Bars and labels */}
        {data.map((item, index) => {
          const barX = paddingLeft + barGap / 2 + index * totalBarWidth;
          const barHeight = (item.score / maxScore) * chartHeight;
          const barY = yAxisBase - barHeight;

          return (
            <g key={item.id}>
              {/* Bar */}
              <motion.rect
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="#8B5CF6"
                rx="10"
                initial={{ height: 0, y: yAxisBase }}
                animate={{ height: barHeight, y: barY }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1]
                }}
              />

              {/* Label below x-axis */}
              <text
                x={barX + barWidth / 2}
                y={yAxisBase + 35}
                textAnchor="middle"
                fill="#A78BFA"
                fontSize="17"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {item.subject}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
