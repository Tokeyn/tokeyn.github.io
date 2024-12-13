'use client';

import { pinyin } from 'pinyin-pro';
import { SVGProps, useCallback, useMemo, useState } from 'react';
import { cn } from '../lib/utils';

interface Props extends SVGProps<SVGSVGElement> {
  character?: string;
}

export function Pinyin({ character, className, ...props }: Props) {
  const colors = useMemo(
    () => [
      'fill-red-600',
      'fill-blue-600',
      'fill-orange-600',
      'fill-cyan-600',
      'fill-amber-600',
      'fill-sky-600',
      'fill-violet-600',
      'fill-lime-600',
      'fill-emerald-600',
      'fill-green-600',
      'fill-teal-600',
      'fill-purple-600',
      'fill-fuchsia-600',
      'fill-pink-600',
    ],
    []
  );
  const pinyins = useMemo(
    () =>
      character != null
        ? pinyin(character, {
            multiple: true,
          }).split(' ')
        : [],
    [character]
  );
  const numPinyins = pinyins.length;

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onClick = useCallback(() => {
    setSelectedIndex(selectedIndex => (selectedIndex + 1) % numPinyins);
  }, [numPinyins]);

  return (
    <svg
      viewBox="0 0 240 120"
      {...props}
      className={cn(
        {
          'cursor-pointer': numPinyins > 1,
        },
        className
      )}
      onClick={onClick}
    >
      <text
        x="50%"
        textAnchor="middle"
        y="80"
        fontSize={80}
        className={cn('font-pinyin print:fill-foreground', {
          [colors[selectedIndex]]: numPinyins > 1,
        })}
      >
        {pinyins[selectedIndex]}
      </text>
    </svg>
  );
}
