"use server";

import { jsonSchemaToRootSchema } from "@/src/utils/parser/json-schema-to-app-schema";
import app from "@/src/lib/app";
import { convertTsToJsonSchema } from "@/src/utils/parser/typescript-type-to-json-schema";
import { RootSchema } from "@/src/types/room";
import { revalidatePath } from "next/cache";

export async function updateSchema(
  roomId: string,
  requestId: string,
  schema: RootSchema
) {
  const result = await app.schema.save(roomId, requestId, schema);
  revalidatePath(`/e/${roomId}`);
  return result;
}

export async function updateCodeSchema(
  roomId: string,
  requestId: string,
  code: string,
  language: string
) {
  console.log("updateCodeSchema", language);

  const jsonSchema = convertTsToJsonSchema(code);

  console.log("jsonSchema ===>", JSON.stringify(jsonSchema, null, 2));

  const schema = jsonSchemaToRootSchema(jsonSchema);

  console.log("schema ===>", JSON.stringify(schema, null, 2));

  const result = await app.schema.save(roomId, requestId, schema);
  revalidatePath(`/e/${roomId}`);
  return result;
}

export async function updateRequest(
  roomId: string,
  requestId: string,
  data: Parameters<typeof app.request.save>[2]
) {
  const result = app.request.save(roomId, requestId, data);
  revalidatePath(`/e/${roomId}`);
  return result;
}
