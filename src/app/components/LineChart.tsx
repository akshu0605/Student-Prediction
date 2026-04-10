import { motion } from "motion/react";

interface DataPoint {
  id: string;
  month: string;
  score: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export function LineChart({ data }: LineChartProps) {
  const maxScore = 100;
  const width = 800;
  const height = 450;
  const paddingLeft = 80;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 80;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Y-axis base
  const yAxisBase = paddingTop + chartHeight;

  // Calculate points
  const points = data.map((point, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = yAxisBase - (point.score / maxScore) * chartHeight;
    return { x, y, ...point };
  });

  // Create path
  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

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

        {/* Line path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Points and labels */}
        {points.map((point, index) => (
          <g key={point.id}>
            {/* Point */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="#3B82F6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.8 + index * 0.15,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            />

            {/* Label below x-axis */}
            <text
              x={point.x}
              y={yAxisBase + 35}
              textAnchor="middle"
              fill="#60A5FA"
              fontSize="17"
              fontWeight="500"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
