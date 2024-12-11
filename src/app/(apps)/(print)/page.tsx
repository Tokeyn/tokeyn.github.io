'use client';

import { Button } from '#/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';
import { Textarea } from '#/components/ui/textarea';
import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import Sentence from './components/sentence';

export default function Home() {
  const [text, setText] = useState('');

  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const onClearClick = useCallback(() => {
    setInputText('');
  }, []);

  const onSubmitClick = useCallback(() => {
    const inputTextTrim = inputText.trim();
    if (inputTextTrim) {
      setOpen(false);
      setText(inputTextTrim);
    } else {
      alert('请输入文字后再进行下一步');
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="hidden print:block">
        Are you seriously trying to print this? It's secret!
      </div>
      <Button onClick={() => setOpen(true)}>打开输入弹窗</Button>

      <div className="mt-4">
        <Sentence value={text} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>请输入多行文字</DialogTitle>
          </DialogHeader>
          <div>
            <Textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="在此输入多行文字..."
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearClick}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清空
            </Button>
            <Button onClick={onSubmitClick}>下一步</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
