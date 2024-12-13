import { SVGProps } from 'react';

export function HanziGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 120" {...props}>
      <path
        d="M4 60 H118 Z"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M60 4 V118 Z"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
export function PinyinGrid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 120" {...props}>
      <path
        d="M4 40 H232 Z"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M4 80 H232 Z"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
