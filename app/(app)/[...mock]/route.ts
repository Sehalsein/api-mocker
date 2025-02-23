import { appSchemaToJsonData } from "@/src/utils/parser/app-schema-to-json-data";
import { getRoom } from "@/src/lib/app/room";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const [roomId, ...path] = url.pathname.split("/").filter(Boolean);
  const stringPath = path.join("/");

  const pathKey = `${req.method}_/${stringPath}`;

  const room = await getRoom(roomId);

  console.log(room, pathKey);

  const requestId = room.pathKey[pathKey];

  if (!requestId) {
    return new Response(
      JSON.stringify({
        message: "Request route not found",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
        status: 404,
      }
    );
  }

  const request = room.requests[requestId];

  return new Response(JSON.stringify(appSchemaToJsonData(request.schema)), {
    headers: {
      "content-type": "application/json",
    },
  });
}
