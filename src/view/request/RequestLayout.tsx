import { ApiRequest } from "@/src/types/room";
import RequestMethodDropdown from "./RequestMethodDropdown";
import { PropsWithChildren } from "react";
import RequestPathInput from "./RequestPathInput";
import RequestShareButton from "./RequestShareButton";
import SchemaProvider from "@/src/context/SchemaProvider";

type Props = Required<PropsWithChildren> & {
  roomId: string;
  requestId: string;
  request: ApiRequest;
  baseUrl: string;
};

export default function RequestLayout(props: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <RequestMethodDropdown
          roomId={props.roomId}
          requestId={props.requestId}
          defaultValue={props.request.method}
        />
        <RequestPathInput
          roomId={props.roomId}
          requestId={props.requestId}
          defaultValue={props.request.path}
          baseUrl={props.baseUrl}
        />
        <RequestShareButton
          roomId={props.roomId}
          request={props.request}
          baseUrl={props.baseUrl}
        />
      </div>
      <SchemaProvider schema={props.request.schema}>
        {props.children}
      </SchemaProvider>
    </div>
  );
}
