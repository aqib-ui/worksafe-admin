import React from "react";

export default function Loader({
  size = 20,
  stroke = 4,
  speed = 1,
  color = "white",
  disabled = false,
  style = {},
}) {
  const viewBoxSize = 50;
  const cx = viewBoxSize / 2;
  const cy = viewBoxSize / 2;
  const radius = cx - stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const visibleLength = circumference * 0.7;
  const gapLength = circumference - visibleLength;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
      aria-hidden="true"
    >
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeOpacity={0.12}
        strokeWidth={stroke}
      />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${visibleLength} ${gapLength}`}
          strokeDashoffset="0"
        >
          {!disabled && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur={`${speed}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>
    </svg>
  );
}
