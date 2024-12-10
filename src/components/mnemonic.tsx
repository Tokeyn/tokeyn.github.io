import { useMemo } from 'react';
import Sentence from './sentence';

interface MnemonicProps {
  locale: string;
  value: string;
  onChange?: (value: string) => void;
}

export function Mnemonic({ locale, ...props }: MnemonicProps) {
  const MnemonicComponent = useMemo(() => {
    switch (locale) {
      case 'zh_cn':
        return MnemonicCn;
      default:
        return DefaultMnemonicComponent;
    }
  }, [locale]);
  return <MnemonicComponent {...props} />;
}

interface MnemonicComponentProps {
  value: string;
  onChange?: (value: string) => void;
}

export function MnemonicCn({ value }: MnemonicComponentProps) {
  const sentences = useMemo(() => value.split(' '), [value]);
  return (
    <article className="container mx-auto h-full overflow-auto p-2">
      {sentences.map((segment, i) => (
        <Sentence key={i} value={segment} />
      ))}
    </article>
  );
}
export function DefaultMnemonicComponent({
  value,
  onChange,
}: MnemonicComponentProps) {
  return (
    <article className="container mx-auto h-full overflow-auto p-2">
      <textarea
        className="text-xs font-mono w-full"
        value={value}
        onChange={event => onChange?.(event.target.value)}
      />
    </article>
  );
}
