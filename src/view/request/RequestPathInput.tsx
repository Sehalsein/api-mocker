"use client";

import { updateRequest } from "@/app/(app)/e/[roomId]/[requestId]/actions";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { memo, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";

const DEBOUNCE_DELAY = 300; // milliseconds

type Props = {
  roomId: string;
  requestId: string;
  defaultValue: string;
  baseUrl: string;
};

const RequestPathInput = memo(function RequestPathInput({
  roomId,
  requestId,
  defaultValue,
  baseUrl,
}: Props) {
  const debounced = useDebouncedCallback((value) => {
    updateRequest(roomId, requestId, { path: value });
  }, DEBOUNCE_DELAY);

  const domainDisplay = useMemo(
    () => (
      <span className="text-sm font-medium border border-input h-9 rounded-md self-center rounded-r-none px-2 py-1.5 bg-secondary text-secondary-foreground">
        {baseUrl}
      </span>
    ),
    [baseUrl]
  );

  return (
    <div className="flex items-center justify-center w-full">
      {domainDisplay}
      <Label htmlFor="path" className="sr-only">
        Path
      </Label>
      <Input
        defaultValue={defaultValue}
        type="text"
        id="path"
        placeholder="Enter endpoint path eg: /users"
        className="rounded-l-none flex-1"
        onChange={(e) => debounced(e.target.value)}
      />
    </div>
  );
});
RequestPathInput.displayName = "RequestPathInput";

export default RequestPathInput;
