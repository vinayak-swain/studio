import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2l3.09 6.32L22 9.32l-5.32 5.09L18.61 22 12 18.32 5.39 22l1.92-7.59L2 9.32l6.91-1Z" />
    </svg>
  );
}
