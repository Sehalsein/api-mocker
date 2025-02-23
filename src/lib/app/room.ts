import { Room } from "@/src/types/room";
import redis from "./db/redis";
import { EMPTY_ROOM } from "./helper";

export async function saveRoom(roomId: string, room: Room) {
  await redis.set(`room:${roomId}`, JSON.stringify(room));
}

export async function getRoom(roomId: string) {
  const room = await redis.get<Room>(`room:${roomId}`);

  if (!room) {
    return EMPTY_ROOM;
  }

  return room;
}
