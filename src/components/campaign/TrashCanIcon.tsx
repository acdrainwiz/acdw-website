/** Campaign trash can — lid animates via `.ttf-modal-trash-can-lid` in CSS. */
export function TrashCanIcon({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <svg
        className="ttf-modal-trash-can-svg"
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="ttf-modal-trash-can-body"
          d="M8 13.5h16v17a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 8 30.5v-17Z"
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path
          className="ttf-modal-trash-can-body"
          d="M12.5 18.5h7M12.5 22h7M12.5 25.5h5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.55"
        />
        <g className="ttf-modal-trash-can-lid">
          <path
            d="M6 13.5 8 10.5h16l2 3H6Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 8.25h5a1.25 1.25 0 0 0 0-2.5h-5a1.25 1.25 0 0 0 0 2.5Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.25"
          />
        </g>
      </svg>
    </span>
  )
}
