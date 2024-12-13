'use client';

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

  return data ? (
    <div className="flex" style={{ width: 558 }}>
      <div className="flex flex-col -mr-px">
        <div className="w-32 h-16 -mb-px relative">
          <svg viewBox="0 0 1200 600" className="w-32 h-16">
            <GraphicsPinyinGridSVG className="[&_path]:stroke-gray-600 [&_path]:fill-black" />
          </svg>
          <div className="font-pinyin font-extralight absolute inset-0 bottom-1/3 flex items-end justify-center text-4xl leading-none">
            {pinyin(word)}
          </div>
        </div>
        <svg viewBox="0 0 1200 1200" className="w-32 h-32 -mt-px">
          <GraphicsSVG
            strokes={data.strokes}
            className="[&_path]:stroke-red-700 [&_path]:fill-black "
          />
          <GraphicsGridSVG className="[&_path]:stroke-gray-600 [&_path]:fill-black" />
        </svg>
      </div>
      <div className="flex flex-wrap -ml-px">
        {data.strokes.map((_, i, array) => (
          <svg key={i} viewBox="0 0 1200 1200" className="w-16 h-16 -m-px">
            <GraphicsSVG
              strokes={array}
              endIndex={i}
              className="[&_path]:fill-gray-300"
            />
            <GraphicsGridSVG className="[&_path]:stroke-gray-600 [&_path]:fill-black" />
          </svg>
        ))}
        {grids?.map((_, i) => (
          <svg key={i} viewBox="0 0 1200 1200" className="w-16 h-16 -m-px">
            <GraphicsSVG
              strokes={data.strokes}
              className="[&_path]:fill-gray-300"
            />
            <GraphicsGridSVG className="[&_path]:stroke-gray-600 [&_path]:fill-black" />
          </svg>
        ))}
      </div>
    </div>
  ) : null;
}

interface GraphicsSVGProps extends SVGProps<SVGGElement> {
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
    <g
      viewBox="0 0 1024 1024"
      transform="scale(1, -1) translate(88, -988)"
      {...props}
    >
      {strokeParts.map((stroke, i) => (
        <path key={i} d={stroke} />
      ))}
    </g>
  );
}
function GraphicsGridSVG(props: SVGProps<SVGGElement>) {
  return (
    <g viewBox="0 0 80 80" transform="scale(15)" {...props}>
      <path
        d="M-2 40 L80 40"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M40 -2 L40 80"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 1 l78 0 l0 78 l-78 0 Z"
        strokeWidth="2"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
function GraphicsPinyinGridSVG(props: SVGProps<SVGGElement>) {
  return (
    <g viewBox="0 0 240 120" transform="scale(5)" {...props}>
      <path
        d="M-2 40 L240 40"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-2 80 L240 80"
        strokeDasharray="4,4"
        strokeWidth="1"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 1 l238 0 l0 118 l-238 0 Z"
        strokeWidth="2"
        fillOpacity="0"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}
