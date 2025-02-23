import { getRequest, saveRequest } from "./request";
import { getRoom } from "./room";
import { getSchema, saveSchema } from "./schema";

const app = {
  request: {
    get: getRequest,
    save: saveRequest,
  },
  schema: {
    get: getSchema,
    save: saveSchema,
  },
  room: {
    get: getRoom,
  },
};

export default app;
