'use client';

import { cn } from '#/lib/utils';
import { pinyin } from 'pinyin-pro';
import { SVGProps, useMemo } from 'react';
import useSWR from 'swr';

type Props = {
  word: string;
};

type GraphicsItem = {
  word: string;
  strokes: string[];
  medians: number[][][];
};

export function Hanzi({ word }: Props) {
  const { data } = useSWR(
    [word],
    async ([word]) =>
      (await import(`#/assets/data-cn/${word}.json`)).default as GraphicsItem
  );
  const grids = useMemo(
    () =>
      data != null
        ? Array.from({ length: 21 - data.strokes.length }, (_, i) => i)
        : null,
    [data]
  );
  const borderClass = 'border border-black';

  return data ? (
    <div className={cn('flex w-[36rem] box-content', borderClass)}>
      <div className="flex flex-col">
        <div className="w-32 h-16 relative">
          <GraphicsPinyinGridSVG
            className={cn(
              'w-full h-full [&_path]:stroke-gray-400',
              borderClass
            )}
          />
          <div className="font-pinyin absolute inset-0 bottom-1/3 flex items-end justify-center text-4xl leading-none">
            {pinyin(word)}
          </div>
        </div>
        <div className="w-32 h-32 relative">
          <GraphicsGridSVG
            className={cn(
              'w-full h-full [&_path]:stroke-gray-400',
              borderClass
            )}
          />
          <GraphicsSVG
            strokes={data.strokes}
            className="absolute inset-0 [&_path]:fill-black"
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        {data.strokes.map((_, i, array) => (
          <div key={i} className="w-16 h-16 relative">
            <GraphicsGridSVG
              className={cn(
                'w-full h-full [&_path]:stroke-gray-400',
                borderClass
              )}
            />
            <GraphicsSVG
              strokes={array}
              endIndex={i}
              className={'absolute inset-0 w-16 h-16 [&_path]:fill-gray-300'}
            />
          </div>
        ))}
        {grids?.map((_, i) => (
          <div key={i} className="w-16 h-16 relative">
            <GraphicsGridSVG
              className={cn('[&_path]:stroke-gray-400', borderClass)}
            />
            {/* <GraphicsSVG
              strokes={data.strokes}
              className="absolute inset-0 w-16 h-16 [&_path]:stroke-gray-600 [&_path]:fill-none"
            /> */}
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

interface GraphicsSVGProps extends SVGProps<SVGSVGElement> {
  strokes: string[];
  beginIndex?: number;
  endIndex?: number;
}
function GraphicsSVG({
  strokes,
  beginIndex = 0,
  endIndex = 0xffffff,
  ...props
}: GraphicsSVGProps) {
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
function GraphicsGridSVG(props: SVGProps<SVGSVGElement>) {
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
function GraphicsPinyinGridSVG(props: SVGProps<SVGSVGElement>) {
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
