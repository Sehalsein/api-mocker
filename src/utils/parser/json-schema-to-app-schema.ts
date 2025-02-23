/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootSchema, Schema } from "@/src/types/room";

export function jsonSchemaToAppSchema(
  jsonSchema: any,
  key = "",
  definitions: Record<string, any> = {}
): Schema {
  if (jsonSchema.$ref) {
    return {
      key,
      $ref: jsonSchema.$ref,
      ref: cleanRef(jsonSchema.$ref),
      type: "object",
    };
  }

  const schema: Schema = {
    key,
    ref: key,
    type: jsonSchema.type,
  };

  if (jsonSchema.type === "object" && jsonSchema.properties) {
    schema.properties = Object.entries(jsonSchema.properties).reduce(
      (acc, [propKey, propSchema]: [string, any]) => {
        acc[propKey] = jsonSchemaToAppSchema(propSchema, propKey, definitions);
        return acc;
      },
      {} as Record<string, Schema>
    );
  }

  if (jsonSchema.type === "array" && jsonSchema.items) {
    schema.items = jsonSchemaToAppSchema(jsonSchema.items, key, definitions);
  }

  return schema;
}

export function jsonSchemaToRootSchema(jsonSchema: any): RootSchema {
  const definitions = jsonSchema.definitions || {};
  return {
    definitions: Object.entries(definitions).reduce((acc, [key, value]) => {
      acc[key] = jsonSchemaToAppSchema(value, key, definitions);
      return acc;
    }, {} as Record<string, Schema>),
    $ref: jsonSchema.$ref,
    ref: cleanRef(jsonSchema.$ref),
  };
}

function cleanRef(ref: string): string {
  return ref.replace("#/definitions/", "");
}
