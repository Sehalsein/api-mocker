import {
  Schema,
  ApiRequest,
  Room,
  RequestMethod,
  RootSchema,
} from "@/src/types/room";

export const EMPTY_SCHEMA: Schema = {
  key: "",
  type: "object",
  properties: {},
};

export const EMPTY_ROOT_SCHEMA: RootSchema = {
  definitions: {
    Response: EMPTY_SCHEMA,
  },
  $ref: "#/definitions/Response",
  ref: "Response",
};

export const EMPTY_REQUEST: ApiRequest = {
  path: "/",
  method: RequestMethod.GET,
  schema: EMPTY_ROOT_SCHEMA,
};

export const EMPTY_ROOM: Room = {
  requests: {},
  pathKey: {},
};
