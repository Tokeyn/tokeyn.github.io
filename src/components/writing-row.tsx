'use client';

import { cn } from '#/lib/utils';
import { pinyin } from 'pinyin-pro';
import { SVGProps, useMemo } from 'react';
import useSWR from 'swr';

interface Props {
  word: string;
}

type GraphicsItem = {
  strokes: string[];
};

export function WritingRow({ word }: Props) {
  const { data } = useSWR(
    [word],
    async ([word]) =>
      (await import(`#/assets/data-cn/${word}.json`)).default as GraphicsItem
  );
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
        <GraphicsPinyinGridSVG
          className={cn('[&_path]:stroke-gray-400 aspect-[2]', borderClass)}
        />
        <div className="font-pinyin absolute inset-0 bottom-1/3 flex items-end justify-center text-4xl leading-none">
          {pinyin(word)}
        </div>
      </div>
      <div className="col-start-1 col-span-2 row-span-2 relative">
        <GraphicsGridSVG
          className={cn('[&_path]:stroke-gray-400', borderClass)}
        />
        <GraphicsSVG
          strokes={data.strokes}
          className="absolute inset-0 [&_path]:fill-black"
        />
      </div>
      {data.strokes.map((_, i, array) => (
        <div key={i} className="relative row-span-1">
          <GraphicsGridSVG
            className={cn('[&_path]:stroke-gray-400', borderClass)}
          />
          <GraphicsSVG
            strokes={array}
            endIndex={i}
            className={'absolute inset-0 [&_path]:fill-gray-300'}
          />
        </div>
      ))}
      {grids?.map((_, i) => (
        <div key={i} className="relative">
          <GraphicsGridSVG
            className={cn('[&_path]:stroke-gray-400', borderClass)}
          />
          {/* <GraphicsSVG
              strokes={data.strokes}
              className="absolute inset-0 w-16 h-16 [&_path]:stroke-gray-600 [&_path]:fill-none"
            /> */}
        </div>
      ))}
    </>
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
