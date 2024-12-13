import { useMemo } from 'react';
import { WritingGrid } from '../../../../components/writing-grid';

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
  const characters = useMemo(() => value.split(' '), [value]);
  return <WritingGrid characters={characters} />;
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
