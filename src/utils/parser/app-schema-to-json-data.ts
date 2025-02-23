import { RootSchema, Schema } from "@/src/types/room";

function convertSchemaToJsonData(
  schema: Schema,
  definitions: Record<string, Schema>
): unknown {
  if (schema.$ref && schema.ref) {
    return convertSchemaToJsonData(definitions[schema.ref], definitions);
  }

  switch (schema.type) {
    case "object":
      return Object.entries(schema.properties ?? {}).reduce(
        (obj, [key, value]) => {
          obj[key] = convertSchemaToJsonData(value, definitions);
          return obj;
        },
        {} as Record<string, unknown>
      );

    case "array":
      const count = Math.floor(Math.random() * 5) + 1; // Random count between 1 and 5
      return Array.from({ length: count }, () =>
        convertSchemaToJsonData(schema.items!, definitions)
      );

    case "string":
      return "Sample String"; // Placeholder value for strings

    case "number":
      return 0; // Placeholder value for numbers

    case "boolean":
      return true; // Placeholder value for booleans

    case "null":
      return null;

    default:
      return "unknown"; // Fallback for unsupported types
  }
}

export function appSchemaToJsonData(schema: RootSchema): unknown {
  const definitions = schema.definitions;
  return convertSchemaToJsonData(definitions[schema.ref], definitions);
}
