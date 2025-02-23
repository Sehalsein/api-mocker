"use client";

import { updateRequest } from "@/app/(app)/e/[roomId]/[requestId]/actions";
import { RequestMethod } from "@/src/types/room";
import {
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/src/components/ui/select";
import { memo, useCallback, useMemo } from "react";

type Props = {
  roomId: string;
  requestId: string;
  defaultValue: RequestMethod;
};

const RequestMethodDropdown = memo(function RequestMethodDropdown({
  roomId,
  requestId,
  defaultValue,
}: Props) {
  const handleMethodChange = useCallback(
    (method: RequestMethod) => {
      updateRequest(roomId, requestId, { method });
    },
    [roomId, requestId]
  );

  const methodOptions = useMemo(
    () =>
      Object.values(RequestMethod).map((method) => (
        <SelectItem key={method} value={method}>
          {method}
        </SelectItem>
      )),
    []
  );

  return (
    <Select
      defaultValue={defaultValue ?? RequestMethod.GET}
      onValueChange={handleMethodChange}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="GET" />
      </SelectTrigger>
      <SelectContent>{methodOptions}</SelectContent>
    </Select>
  );
});

export default RequestMethodDropdown;
