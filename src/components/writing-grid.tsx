'use client';

import { cn } from '../lib/utils';
import { WritingRow } from './writing-row';

interface Props {
  words: string[];
}

export function WritingGrid({ words }: Props) {
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
