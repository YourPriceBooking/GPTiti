type ChatBubbleIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export default function ChatBubbleIcon({
  className,
  width = 24,
  height = 24,
}: ChatBubbleIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="1 1 26 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 8H19M7 12H14.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4 2.5H24C25.1046 2.5 26 3.39543 26 4.5V15.5C26 16.6046 25.1046 17.5 24 17.5H10L5 21.5V17.5H4C2.89543 17.5 2 16.6046 2 15.5V4.5C2 3.39543 2.89543 2.5 4 2.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
