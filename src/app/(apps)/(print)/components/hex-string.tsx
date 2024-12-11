import React, { useMemo } from 'react';

interface Props {
  value?: string | null;
  diameter?: number;
}
/**
 * Hex String
 */
export function HexString({ value, diameter = 12 }: Props) {
  const regexp = useMemo(() => {
    const numElements = Math.round(diameter / 2);
    return new RegExp(`^(\\w{${numElements}}).*(\\w{${numElements}})$`);
  }, [diameter]);
  return <>{value?.replace(regexp, '$1...$2')}</>;
}
