'use client';

import { cn } from '#/lib/utils';
import { useMemo } from 'react';
import useCharacterGlyphSWR from '../data/useCharacterGlyphSWR';
import { Glyph } from './glyph';
import { HanziGrid, PinyinGrid } from './grid';
import { Pinyin } from './pinyin';

interface Props {
  character?: string;
}

export function WritingRow({ character }: Props) {
  const { data } = useCharacterGlyphSWR(character);
  const grids = useMemo(
    () =>
      data != null
        ? Array.from({ length: 30 - data.strokes.length }, (_, i) => i)
        : null,
    [data]
  );
  const borderClass = 'border border-black';
  return data ? (
    <>
      <div className="col-span-2 relative">
        <PinyinGrid
          className={cn('[&_path]:stroke-gray-400 aspect-[2]', borderClass)}
        />
        <Pinyin
          character={character}
          className="font-light absolute inset-0 bottom-1/3 flex items-end justify-center text-2xl leading-none"
        />
      </div>
      <div className="col-start-1 col-span-2 row-span-2 relative">
        <HanziGrid className={cn('[&_path]:stroke-gray-400', borderClass)} />
        <Glyph
          strokes={data.strokes}
          className="absolute inset-0 [&_path]:fill-black"
        />
      </div>
      {data.strokes.map((_, i, array) => (
        <div key={i} className="relative aspect-square">
          <HanziGrid className={cn('[&_path]:stroke-gray-400', borderClass)} />
          <Glyph
            strokes={array}
            endIndex={i}
            className={'absolute inset-0 [&_path]:fill-gray-300'}
          />
        </div>
      ))}
      {grids?.map((_, i) => (
        <div key={i} className="relative aspect-square">
          <HanziGrid className={cn('[&_path]:stroke-gray-400', borderClass)} />
        </div>
      ))}
    </>
  ) : null;
}
