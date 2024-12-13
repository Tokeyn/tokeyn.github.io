'use client';

import { chunk } from 'lodash';
import { HTMLProps, useMemo } from 'react';
import { cn } from '../lib/utils';
import { WritingRow } from './writing-row';

interface Props extends HTMLProps<HTMLDivElement> {
  characters: string[];
  chunkSize?: number;
}

export function WritingGrid({
  characters,
  chunkSize = 0xffffff,
  ...props
}: Props) {
  const chunks = useMemo(
    () => chunk(characters, chunkSize),
    [characters, chunkSize]
  );
  return chunks.length > 0 ? (
    <div {...props}>
      {chunks.map((chunk, i) => (
        <div
          key={i}
          className={cn(
            'print:break-before-page first:print:break-before-avoid break-inside-avoid',
            'grid grid-cols-9 grid-flow-dense',
            'border border-black box-content'
          )}
        >
          {/* {chunk.map((character, i) => (
            <WritingRow key={i} character={character} />
          ))} */}
          {Array.from({ length: chunkSize }).map((_, i) => (
            <WritingRow key={i} character={chunk[i]} />
          ))}
        </div>
      ))}
    </div>
  ) : null;
}
