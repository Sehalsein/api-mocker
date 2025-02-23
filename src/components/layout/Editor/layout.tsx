import { cn } from "@/src/lib/utils";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  roomId: string;
  className?: string;
};

export default function EditorLayout(props: Props) {
  return <div className={cn(props.className)}>{props.children}</div>;
}
