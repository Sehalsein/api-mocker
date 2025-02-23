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

export function appSchemaToJson(schema: Schema): unknown {
  if (schema.type === "object") {
    const data: Record<string, unknown> = {};

    for (const val of Object.values(schema.properties ?? {})) {
      data[val.key] = appSchemaToJson(val);
    }

    return data;
  }

  if (schema.type === "string") {
    return "hello";
  }

  if (schema.type === "number") {
    return 0;
  }

  if (schema.type === "integer") {
    return 0;
  }

  if (schema.type === "boolean") {
    return false;
  }

  if (schema.type === "null") {
    return null;
  }

  if (schema.type === "array") {
    const count = 10;
    return Array.from({ length: count }, () => appSchemaToJson(schema.items!));
  }

  return "Not implemented";
}

/**
 * Helper
 */

function cleanRef(ref: string): string {
  return ref.replace("#/definitions/", "");
}
