import { cn } from "@/src/lib/utils";
import { ApiRequest } from "@/src/types/room";

type Props = {
  request: ApiRequest;
};

export default function RequestListItem(props: Props) {
  return (
    <p className="font-mono text-sm truncate font-medium">
      <span
        className={cn(
          "text-xs font-semibold rounded-md px-2 py-1 mr-2 ",
          "text-gray-800 bg-gray-400",
          props.request.method === "GET" && "bg-green-100 text-green-800",
          props.request.method === "POST" && "bg-blue-100 text-blue-800",
          props.request.method === "PUT" && "bg-yellow-100 text-yellow-800",
          props.request.method === "DELETE" && "bg-red-100 text-red-800",
          props.request.method === "PATCH" && "bg-purple-100 text-purple-800"
        )}
      >
        {props.request.method}
      </span>
      {props.request.path}
    </p>
  );
}
