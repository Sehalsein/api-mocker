import { ApiRequest } from "@/src/types/room";
import { getRoom, saveRoom } from "./room";
import { EMPTY_REQUEST } from "./helper";

export async function saveRequest(
  roomId: string,
  requestId: string,
  request: Partial<ApiRequest>
) {
  const room = await getRoom(roomId);

  if (!room.requests[requestId]) {
    room.requests[requestId] = EMPTY_REQUEST;
  }

  if (request.path !== undefined && !request.path?.startsWith("/")) {
    request.path = "/" + request.path;
  }

  room.requests[requestId] = {
    ...room.requests[requestId],
    ...request,
  };

  room.pathKey = Object.entries(room.requests).reduce((acc, [key, value]) => {
    const pathKey = `${value.method}_${value.path}`;
    acc[pathKey] = key;
    return acc;
  }, {} as Record<string, string>);

  await saveRoom(roomId, room);

  return {
    message: "Request saved",
  };
}

export async function getRequest(roomId: string, requestId: string) {
  const room = await getRoom(roomId);

  if (!room.requests[requestId]) {
    return EMPTY_REQUEST;
  }

  return room.requests[requestId];
}
