"use client";

import { toast } from "sonner";
import { Button } from "./button";
import { Copy } from "lucide-react";

export type Props = Omit<React.ComponentProps<typeof Button>, "children"> & {
  content: string;
};

export function CopyToClipboard({ content, onClick, ...rest }: Props) {
  return (
    <Button
      size="icon"
      onClick={(e) => {
        navigator.clipboard.writeText(content);
        onClick?.(e);
        toast("Copied to clipboard");
      }}
      {...rest}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}
