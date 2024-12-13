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
import { useCallback, useMemo, useState } from 'react';
import { WritingGrid } from '../../../components/writing-grid';

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
  }, [inputText]);
  const characters = useMemo(() => text.split(/\s*/), [text]);
  return (
    <div className="flex flex-col gap-4 p-4 print:p-0">
      <div className="print:hidden flex items-center justify-end gap-4">
        <Button onClick={() => setOpen(true)}>打开输入弹窗</Button>
        <Button onClick={() => print()}>打印</Button>
      </div>
      <WritingGrid
        characters={characters}
        chunkSize={3}
        className="flex flex-col gap-4"
      />
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
