export function RootCauseHealthLogo({
  className,
  width,
  height,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Leaf shape */}
      <path
        d="M20 4C12 4 6 12 6 20C6 28 12 36 20 36C20 36 20 28 20 20C20 12 20 4 20 4Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M20 4C28 4 34 12 34 20C34 28 28 36 20 36C20 36 20 28 20 20C20 12 20 4 20 4Z"
        fill="currentColor"
        opacity="0.9"
      />
      {/* Pulse line */}
      <path
        d="M8 21H14L16 16L20 26L24 18L26 21H32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
    </svg>
  );
}
