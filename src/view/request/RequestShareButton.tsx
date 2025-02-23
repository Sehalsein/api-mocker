import { Button } from "@/src/components/ui/button";
import { CopyToClipboard } from "@/src/components/ui/copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ApiRequest } from "@/src/types/room";
import { LinkIcon } from "lucide-react";
import { memo } from "react";

type Props = {
  roomId: string;
  request: ApiRequest;
  className?: string;
  baseUrl: string;
};

const RequestShareButton = memo(function ShareButton(props: Props) {
  const url = `${props.baseUrl}${props.request.path}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className={props.className}>
          <LinkIcon size={16} />
          <span className="sr-only">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Url</DialogTitle>
          <DialogDescription>
            Share this request with others by copying the link below. Anyone
            with the link can view this request.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={url} readOnly className="h-9" />
          </div>
          <CopyToClipboard content={url} />
        </div>
      </DialogContent>
    </Dialog>
  );
});
RequestShareButton.displayName = "RequestShareButton";

export default RequestShareButton;
