import { motion } from "motion/react";
import { Calculator, FlaskConical, BookOpen, Landmark, Code } from "lucide-react";

interface SubjectData {
  subject: string;
  score: number;
  icon: typeof Calculator;
}

interface RadarChartProps {
  data: SubjectData[];
  averageScore: number;
}

export function RadarChart({ data, averageScore }: RadarChartProps) {
  const centerX = 300;
  const centerY = 300;
  const maxRadius = 200;
  const maxScore = 100;
  const numAxes = data.length;

  // Calculate points for the radar chart
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const radius = (value / maxScore) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Get label positions (outside the chart)
  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const radius = maxRadius + 60;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // Create grid circles
  const gridLevels = [20, 40, 60, 80, 100];

  // Create axis lines
  const axisLines = data.map((_, index) => {
    const point = getPoint(index, 100);
    return { x: point.x, y: point.y };
  });

  // Create data polygon path
  const dataPoints = data.map((item, index) => getPoint(index, item.score));
  const dataPath = dataPoints.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ') + ' Z';

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        className="drop-shadow-2xl"
      >
        <defs>
          {/* Gradient for the data fill */}
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
          </linearGradient>

          {/* Gradient for the border */}
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid circles */}
        {gridLevels.map((level, index) => {
          const radius = (level / maxScore) * maxRadius;
          return (
            <circle
              key={`grid-${level}`}
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
              opacity={0.2}
            />
          );
        })}

        {/* Axis lines */}
        {axisLines.map((point, index) => (
          <line
            key={`axis-${index}`}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke="#374151"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Data area with gradient fill */}
        <motion.path
          d={dataPath}
          fill="url(#radarGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="3"
          filter="url(#glow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <motion.g key={`point-${index}`}>
            {/* Outer glow circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              fill="url(#borderGradient)"
              opacity="0.3"
              filter="url(#glow)"
            />
            {/* Main point */}
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="url(#borderGradient)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            />
          </motion.g>
        ))}

        {/* Subject labels and icons */}
        {data.map((item, index) => {
          const labelPos = getLabelPoint(index);
          const Icon = item.icon;

          return (
            <g key={`label-${index}`}>
              {/* Icon background */}
              <motion.circle
                cx={labelPos.x}
                cy={labelPos.y - 25}
                r="18"
                fill="rgba(251, 146, 60, 0.15)"
                stroke="url(#borderGradient)"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              />

              {/* Subject name */}
              <text
                x={labelPos.x}
                y={labelPos.y + 10}
                textAnchor="middle"
                fill="#d2ccc4"
                fontSize="12"
                fontFamily="'Inter', 'Geist Mono', monospace"
                fontWeight="500"
              >
                {item.subject}
              </text>

              {/* Score */}
              <text
                x={labelPos.x}
                y={labelPos.y + 28}
                textAnchor="middle"
                fill="#fb923c"
                fontSize="14"
                fontFamily="'Inter', 'Geist Mono', monospace"
                fontWeight="600"
              >
                {item.score}
              </text>
            </g>
          );
        })}

        {/* Center circle - Average Score */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {/* Outer glow */}
          <circle
            cx={centerX}
            cy={centerY}
            r="55"
            fill="rgba(251, 146, 60, 0.1)"
            filter="url(#glow)"
          />
          {/* Main circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="45"
            fill="rgba(0, 0, 0, 0.8)"
            stroke="url(#borderGradient)"
            strokeWidth="2.5"
          />
          {/* Average score */}
          <text
            x={centerX}
            y={centerY - 5}
            textAnchor="middle"
            fill="url(#borderGradient)"
            fontSize="32"
            fontFamily="'Inter', 'Geist Mono', monospace"
            fontWeight="700"
          >
            {averageScore.toFixed(1)}
          </text>
          {/* Label */}
          <text
            x={centerX}
            y={centerY + 20}
            textAnchor="middle"
            fill="#d2ccc4"
            fontSize="10"
            fontFamily="'Inter', 'Geist Mono', monospace"
            fontWeight="400"
            opacity="0.7"
          >
            AVERAGE
          </text>
        </motion.g>
      </svg>

      {/* Floating icons using Lucide components */}
      <div className="absolute inset-0 pointer-events-none">
        {data.map((item, index) => {
          const labelPos = getLabelPoint(index);
          const Icon = item.icon;

          return (
            <motion.div
              key={`icon-${index}`}
              className="absolute"
              style={{
                left: `${(labelPos.x / 600) * 100}%`,
                top: `${((labelPos.y - 25) / 600) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -3, 0],
              }}
              transition={{
                scale: { delay: 0.8 + index * 0.1, duration: 0.5 },
                opacity: { delay: 0.8 + index * 0.1, duration: 0.5 },
                y: {
                  delay: 1.5,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <Icon className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
