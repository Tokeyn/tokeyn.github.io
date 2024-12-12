'use client';

import { useMemo } from 'react';
import { cn } from '../lib/utils';
import { WritingRow } from './writing-row';

interface Props {
  text: string;
}

export function WritingGrid({ text }: Props) {
  const words = useMemo(() => text.split(''), [text]);
  return words.length > 0 ? (
    <div
      className={cn(
        'w-[36rem] box-content grid grid-cols-9 grid-flow-dense',
        'border border-black'
      )}
    >
      {words.map((word, i) => (
        <WritingRow key={i} word={word} />
      ))}
    </div>
  ) : null;
}
