import { SVGProps, useMemo } from 'react';

interface HanziSVGProps extends SVGProps<SVGSVGElement> {
  strokes: string[];
  beginIndex?: number;
  endIndex?: number;
}
export function Glyph({
  strokes,
  beginIndex = 0,
  endIndex = 0xffffff,
  ...props
}: HanziSVGProps) {
  const strokeParts = useMemo(
    () => strokes.slice(beginIndex, endIndex + 1),
    [strokes, beginIndex, endIndex]
  );
  return (
    <svg viewBox="0 0 1024 1024" {...props}>
      <g transform="scale(1, -1) translate(0, -900)">
        {strokeParts.map((stroke, i) => (
          <path key={i} d={stroke} />
        ))}
      </g>
    </svg>
  );
}
