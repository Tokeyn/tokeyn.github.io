'use client';

import { cn } from '#/lib/utils';
import { pinyin } from 'pinyin-pro';
import { useMemo } from 'react';
import { Hanzi } from './hanzi';

type Props = {
  value: string;
};

export default function Sentence({ value }: Props) {
  const wordSegmenter = useMemo(
    () =>
      // @ts-ignore
      new Intl.Segmenter('cn', { granularity: 'word' }),
    []
  );
  const colors = useMemo(
    () => [
      'text-red-600',
      'text-blue-600',
      'text-indigo-600',
      'text-orange-600',
      'text-cyan-600',
      'text-amber-600',
      'text-sky-600',
      'text-violet-600',
      'text-lime-600',
      'text-emerald-600',
      'text-green-600',
      'text-teal-600',
      'text-purple-600',
      'text-fuchsia-600',
      'text-pink-600',
    ],
    []
  );
  const content = useMemo(() => {
    const words = wordSegmenter.segment(value);
    const colorCache: Record<string, string> = {};
    let index = 0;
    const result = [];
    for (let item of words) {
      if (item.segment.length >= 2) {
        if (!colorCache[item.segment]) {
          colorCache[item.segment] = colors[index++];
          if (index >= colors.length) {
            index = 0;
          }
        }
      }
      result.push(
        item.isWordLike ? (
          <div
            key={item.index}
            className={cn('inline-flex flex-col px-1', {
              [colorCache[item.segment]]: item.segment.length >= 2,
            })}
          >
            <div
              className={cn(
                'w-16 h-6 flex justify-center font-serif text-base',
                {
                  'text-gray-500': item.segment.length == 1,
                }
              )}
            >
              {pinyin(item.segment)}
            </div>
            {item.segment.split('').map((word: string, i: number) => (
              <Hanzi key={i} word={word} />
            ))}
          </div>
        ) : item.segment == '\n' ? (
          <br key={item.index} />
        ) : (
          <span key={item.index} className="font-bold text-black align-bottom">
            {item.segment}
          </span>
        )
      );
    }
    return result;
  }, [value, colors]);

  return <div className="flex flex-col gap-2">{content}</div>;
}
