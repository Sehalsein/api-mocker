import { RootSchema } from "@/src/types/room";
import { getRoom, saveRoom } from "./room";
import { EMPTY_REQUEST, EMPTY_ROOT_SCHEMA } from "./helper";

export async function saveSchema(
  roomId: string,
  requestId: string,
  schema: RootSchema
) {
  const room = await getRoom(roomId);
  const requests = room.requests;

  if (!requests[requestId]) {
    requests[requestId] = EMPTY_REQUEST;
  }

  requests[requestId].schema = schema;

  room.requests = requests;
  room.updatedAt = new Date().toISOString();

  await saveRoom(roomId, room);

  return {
    message: "Schema saved",
  };
}

export async function getSchema(roomId: string, requestId: string) {
  const room = await getRoom(roomId);

  if (!room.requests[requestId]) {
    return EMPTY_ROOT_SCHEMA;
  }

  return room.requests[requestId].schema;
}
