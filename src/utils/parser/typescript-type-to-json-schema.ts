/* eslint-disable @typescript-eslint/no-explicit-any */
import ts from "typescript";

function parseJSDocTags(node: ts.Node): string | undefined {
  const jsDocs = ts.getJSDocTags(node);
  if (jsDocs.length > 0) {
    return jsDocs
      .map((tag) => `@${tag.tagName.getText()} ${tag.comment ?? ""}`)
      .join("\n");
  }
  return undefined;
}

function parseTypeNode(typeNode: ts.TypeNode): any {
  if (!typeNode) return { type: "unknown" };

  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword:
      return { type: "string" };
    case ts.SyntaxKind.NumberKeyword:
      return { type: "number" };
    case ts.SyntaxKind.BooleanKeyword:
      return { type: "boolean" };
    case ts.SyntaxKind.ArrayType:
      return {
        type: "array",
        items: parseTypeNode((typeNode as ts.ArrayTypeNode).elementType),
      };
    case ts.SyntaxKind.TypeReference:
      return {
        $ref: `#/definitions/${(
          typeNode as ts.TypeReferenceNode
        ).typeName.getText()}`,
      };
    default:
      return { type: "object" };
  }
}

function extractTypes(sourceFile: ts.SourceFile): Record<string, any> {
  const schema: Record<string, any> = { definitions: {} };
  let rootType: string | null = null;

  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const typeName = node.name.text;
      console.log(typeName, node.type);
      if (ts.isTypeLiteralNode(node.type)) {
        schema.definitions[typeName] = {
          type: "object",
          properties: {},
        };

        node.type.members.forEach((member) => {
          if (
            ts.isPropertySignature(member) &&
            member.type &&
            ts.isIdentifier(member.name)
          ) {
            const propertySchema = parseTypeNode(member.type);
            const comment = parseJSDocTags(member);
            if (comment) {
              propertySchema.comment = comment;
            }
            schema.definitions[typeName].properties[member.name.text] =
              propertySchema;
          }
        });
      } else if (ts.isArrayTypeNode(node.type)) {
        schema.definitions[typeName] = {
          type: "array",
          items: parseTypeNode(node.type.elementType),
        };
      }
    } else if (
      ts.isExportAssignment(node) &&
      ts.isIdentifier(node.expression)
    ) {
      rootType = node.expression.text;
    }
  });

  if (rootType) {
    schema.$ref = `#/definitions/${rootType}`;
  }

  return schema;
}

export function convertTsToJsonSchema(code: string): any {
  const sourceFile = ts.createSourceFile(
    "code.ts",
    code,
    ts.ScriptTarget.ESNext,
    true
  );
  return extractTypes(sourceFile);
}
