export type Room = {
  subdomain?: string;

  requests: Record<string, ApiRequest>;
  pathKey: Record<string, string>;
  updatedAt?: string;
};

export type ApiRequest = {
  path: string;
  method: RequestMethod;
  schema: RootSchema;
};

export type RootSchema = {
  definitions: Record<string, Schema>;
  $ref: string;
  ref: string;
};

export type Schema = {
  key: string;
  $ref?: string;
  ref?: string;
  type:
    | "object"
    | "array"
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "null";
  items?: Schema;
  properties?: Record<string, Schema>;
};

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
