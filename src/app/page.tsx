'use client';

import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { Label } from '#/components/ui/label';
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group';
import { Switch } from '#/components/ui/switch';
import { ethers, LangEn, Wordlist } from 'ethers';
import { wordlists as wordlists0 } from 'ethers/wordlists';
import {
  LangCz,
  // LangEn,
  LangEs,
  LangFr,
  LangIt,
  LangJa,
  LangKo,
  LangPt,
  LangZh,
} from 'ethers/wordlists-extra';
import { Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useMemo, useState } from 'react';

const wordlists: Record<string, Wordlist> = {
  cz: LangCz.wordlist(),
  en: LangEn.wordlist(),
  es: LangEs.wordlist(),
  fr: LangFr.wordlist(),
  it: LangIt.wordlist(),
  pt: LangPt.wordlist(),
  ja: LangJa.wordlist(),
  ko: LangKo.wordlist(),
  zh_cn: LangZh.wordlist('cn'),
  zh_tw: LangZh.wordlist('tw'),
};

export default function Page() {
  console.log('====================================');
  console.log('wordlists0', wordlists0);
  console.log('====================================');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const wordlistsKeys = useMemo(() => Object.keys(wordlists), [wordlists]);
  const [wordlistsKey, setWordlistsKey] = useState<string>();

  const [entropy, setEntropy] = useState<ethers.BytesLike | null>(null);

  const mnemonic = useMemo(() => {
    return entropy != null
      ? ethers.Mnemonic.fromEntropy(
          entropy,
          null,
          wordlistsKey != null ? wordlists[wordlistsKey] : null
        )
      : null;
  }, [entropy, wordlists, wordlistsKey]);

  const wallet = useMemo(
    () =>
      mnemonic != null ? ethers.HDNodeWallet.fromMnemonic(mnemonic) : null,
    [mnemonic]
  );

  const onGenerateMnemonic = useCallback(() => {
    const randomBytes = ethers.randomBytes(32);
    setEntropy(randomBytes);
  }, []);

  const onCopy = useCallback(async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }, []);

  return (
    <section className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Ethereum Mnemonic Wallet Generator</CardTitle>
          <CardDescription>
            Generate a new Ethereum wallet mnemonic phrase
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button onClick={onGenerateMnemonic}>Generate New Mnemonic</Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="private-mode"
              checked={showPrivateKey}
              onCheckedChange={setShowPrivateKey}
            />
            <Label htmlFor="private-mode">显示私密信息</Label>
          </div>

          <RadioGroup
            value={wordlistsKey}
            onValueChange={setWordlistsKey}
            className="flex flex-wrap"
          >
            {wordlistsKeys.map(wordlistsKey => (
              <div key={wordlistsKey} className="flex items-center gap-2">
                <RadioGroupItem
                  value={wordlistsKey}
                  id={`wordlists-${wordlistsKey}`}
                />
                <Label
                  htmlFor={`wordlists-${wordlistsKey}`}
                  className="uppercase"
                >
                  {wordlistsKey}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {mnemonic != null && (
            <>
              <p className="text-xs font-mono">
                {showPrivateKey
                  ? mnemonic.phrase
                  : '********************************'}
              </p>
              <div className="bg-muted p-2 rounded-lg w-full break-all relative">
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2">
                  {mnemonic.phrase.split(/\s/).map((word, index) => (
                    <div
                      key={index}
                      className="h-8 text-sm font-mono bg-white text-primary rounded-full flex items-center justify-center"
                    >
                      {showPrivateKey ? word : '*'}
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1"
                  onClick={() =>
                    onCopy(
                      mnemonic.phrase,
                      'Mnemonic phrase copied to clipboard! Keep it secure!'
                    )
                  }
                  aria-label="Copy mnemonic phrase"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {wallet && (
                <>
                  <div className="bg-muted p-4 rounded-md w-full break-all relative">
                    <p className="text-sm font-mono">{wallet.address}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={() =>
                        onCopy(
                          wallet.address,
                          'Wallet address copied to clipboard!'
                        )
                      }
                      aria-label="Copy wallet address"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <QRCodeSVG value={wallet.address} size={200} />
                  <div className="bg-muted p-4 rounded-md w-full break-all relative">
                    <p className="text-sm font-mono">
                      {showPrivateKey
                        ? wallet.privateKey
                        : '********************************'}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1"
                      onClick={() =>
                        onCopy(
                          wallet.privateKey,
                          'Private key copied to clipboard! Keep it secure!'
                        )
                      }
                      aria-label="Copy private key"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center flex flex-col space-y-2">
          <p>
            Always keep your mnemonic phrase secure and never share it with
            anyone.
          </p>
          <p>
            This mnemonic is generated client-side and is not stored anywhere.
          </p>
          <p>
            The mnemonic phrase can be used to recover your wallet. Store it
            safely offline.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
