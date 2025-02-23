import { RootSchema, Schema } from "@/src/types/room";

function processProperties(schema: Schema): string {
  if (schema.$ref && schema.ref) {
    return schema.ref;
  }

  // Check if the schema defines an object
  if (schema.type === "object") {
    const objectProperties = Object.entries(schema.properties ?? {}).map(
      ([key, value]) => {
        return `${key}: ${processProperties(value)};`;
      }
    );

    objectProperties.unshift("{");

    return objectProperties.join("\n  ") + "\n}";
  }

  // Handle arrays
  if (schema.type === "array" && schema.items) {
    return `${processProperties(schema.items)}[]`;
  }

  // Return type based on the schema type
  switch (schema.type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "null":
      return "null";
    default:
      return "unknown"; // Fallback for unsupported types
  }
}

export function appSchemaToTypes(schema: RootSchema): string {
  const definitions = schema.definitions;

  let responseType = ``;

  Object.entries(definitions).forEach(([key, value]) => {
    responseType += `type ${key} = ${processProperties(value)}\n\n`;
  });

  responseType += `export default ${schema.ref};`;

  return responseType;
}
