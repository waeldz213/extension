export function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  color,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (color) return color;
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring transition-all duration-1000"
        />
      </svg>
      <span
        className="absolute text-lg font-bold"
        style={{ color: getColor() }}
      >
        {score}
      </span>
    </div>
  );
}

export function HeatBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const getConfig = () => {
    if (score >= 81)
      return {
        label: "Brûlant",
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        emoji: "🔥",
      };
    if (score >= 61)
      return {
        label: "Chaud",
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        emoji: "🟠",
      };
    if (score >= 31)
      return {
        label: "Tiède",
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
        emoji: "🟡",
      };
    return {
      label: "Froid",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      emoji: "🔵",
    };
  };

  const config = getConfig();
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2 py-0.5"
      : size === "lg"
        ? "text-base px-4 py-2"
        : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span>{config.emoji}</span>
      <span>{score}</span>
      {size !== "sm" && <span>• {config.label}</span>}
    </span>
  );
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color = "indigo",
}: {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
    green: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    orange: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
    red: "from-red-500/10 to-red-500/5 border-red-500/20",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  };

  const iconColorMap: Record<string, string> = {
    indigo: "text-indigo-400",
    green: "text-emerald-400",
    orange: "text-orange-400",
    red: "text-red-400",
    purple: "text-purple-400",
  };

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 ${colorMap[color] || colorMap.indigo}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">{label}</span>
        <Icon
          size={20}
          className={iconColorMap[color] || iconColorMap.indigo}
        />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-zinc-100">{value}</span>
        {change && (
          <span
            className={`text-xs font-medium mb-1 ${
              change.startsWith("+") ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
