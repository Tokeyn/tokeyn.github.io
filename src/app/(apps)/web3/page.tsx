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
import { Switch } from '#/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs';
import { ethers, LangEn, Wordlist } from 'ethers';
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
import { HexString } from './components/hex-string';
import { Mnemonic } from './components/mnemonic';

const wordlists: Record<string, Wordlist> = Object.fromEntries(
  [
    LangCz.wordlist(),
    LangEn.wordlist(),
    LangEs.wordlist(),
    LangFr.wordlist(),
    LangIt.wordlist(),
    LangPt.wordlist(),
    LangJa.wordlist(),
    LangKo.wordlist(),
    LangZh.wordlist('cn'),
    LangZh.wordlist('tw'),
  ].map(wordlist => [wordlist.locale, wordlist])
);

export default function Page() {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const locales = useMemo(() => Object.keys(wordlists), []);
  const [locale, setLocale] = useState<string>('zh_cn');

  const [entropy, setEntropy] = useState<ethers.BytesLike | null>(null);

  const [manualPhrase, setManualPhrase] = useState<string | null>(null);

  const wordlist = useMemo(
    () => (locale != null ? wordlists[locale] : LangEn.wordlist()),
    [locale]
  );

  const mnemonic = useMemo(() => {
    return entropy != null
      ? ethers.Mnemonic.fromEntropy(entropy, null, wordlist)
      : null;
  }, [entropy, wordlist]);

  const wallet = useMemo(
    () =>
      mnemonic != null ? ethers.HDNodeWallet.fromMnemonic(mnemonic) : null,
    [mnemonic]
  );

  const onGenerateMnemonic = useCallback(() => {
    const randomBytes = ethers.randomBytes(32);
    const mnemonic = ethers.Mnemonic.fromEntropy(randomBytes, null, wordlist);
    setManualPhrase(null);
    setEntropy(mnemonic.entropy);
  }, [wordlist]);

  const setMnemonicLocale = useCallback(
    (locale: string) => {
      setLocale(locale);
      try {
        const wordlistNew = wordlists[locale];
        if (mnemonic != null && wordlistNew != null) {
          const mnemonicNew = ethers.Mnemonic.fromEntropy(
            mnemonic.entropy,
            null,
            wordlistNew
          );
          setManualPhrase(null);
          setEntropy(mnemonicNew.entropy);
        }
      } catch (error) {}
    },
    [mnemonic]
  );
  const setMnemonicPhrase = useCallback(
    (phrase: string) => {
      try {
        const mnemonicNew = ethers.Mnemonic.fromPhrase(phrase, null, wordlist);
        setManualPhrase(null);
        setEntropy(mnemonicNew.entropy);
      } catch (_) {
        setManualPhrase(phrase);
      }
    },
    [wordlist]
  );

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
        <CardContent className="flex flex-col gap-4">
          <Button onClick={onGenerateMnemonic}>Generate New Mnemonic</Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="private-mode"
              checked={showPrivateKey}
              onCheckedChange={setShowPrivateKey}
            />
            <Label htmlFor="private-mode">显示私密信息</Label>
          </div>

          <Tabs value={locale} onValueChange={setMnemonicLocale}>
            <TabsList>
              {/* <TabsTrigger value="account">Account</TabsTrigger> */}
              {/* <TabsTrigger value="password">Password</TabsTrigger> */}
              {locales.map(locale => (
                <TabsTrigger key={locale} value={locale} className="uppercase">
                  {locale}
                </TabsTrigger>
              ))}
            </TabsList>
            {showPrivateKey && mnemonic != null ? (
              <Mnemonic
                locale={locale}
                value={manualPhrase ?? mnemonic.phrase}
                onChange={setMnemonicPhrase}
              />
            ) : null}
          </Tabs>

          {wallet && (
            <div className="flex gap-2 justify-evenly">
              <QRCodeSVG value={wallet.address} size={200} />
              <div className="flex flex-col gap-2">
                <div className="bg-muted px-4 rounded-md w-full flex items-center">
                  <div className="text-sm font-mono">
                    <HexString value={wallet.address} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
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
                <div className="bg-muted px-4 rounded-md w-full flex items-center">
                  <p className="text-sm font-mono">
                    <HexString value={wallet.privateKey} />
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
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
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground"></CardFooter>
      </Card>
    </section>
  );
}
