import { Room } from "@/src/types/room";
import redis from "./db/redis";
import { EMPTY_ROOM } from "./helper";

export async function saveRoom(roomId: string, room: Room) {
  room.updatedAt = new Date().toISOString();
  room.pathKey = Object.entries(room.requests).reduce((acc, [key, value]) => {
    const pathKey = `${value.method}_${value.path}`;
    acc[pathKey] = key;
    return acc;
  }, {} as Record<string, string>);

  await redis.set(`room:${roomId}`, JSON.stringify(room));
}

export async function getRoom(roomId: string) {
  const room = await redis.get<Room>(`room:${roomId}`);

  if (!room) {
    return EMPTY_ROOM;
  }

  return room;
}
