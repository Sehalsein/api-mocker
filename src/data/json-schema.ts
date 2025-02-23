// Move this to a separate constants file in a real application
export const DUMMY_JSON_SCHEMA = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "integer", minimum: 0 },
      email: { type: "string", format: "email" },
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            published: { type: "boolean" },
            publishedAt: { type: "integer", minimum: 0 },
            comments: { type: "array", items: { type: "string" } },
          },
          required: [
            "title",
            "content",
            "published",
            "publishedAt",
            "comments",
          ],
          additionalProperties: false,
        },
      },
      metadata: {
        type: "object",
        properties: {
          token: { type: "string" },
          lastLogin: { type: "integer", minimum: 0 },
        },
        required: ["token", "lastLogin"],
        additionalProperties: false,
      },
    },
    required: ["name", "age", "email", "posts", "metadata"],
    additionalProperties: false,
  },
};

export const DUMMY__SCHEMA = {
  definitions: {
    Response: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        name: {
          type: "string",
        },
        address: {
          type: "array",
          items: {
            type: "string",
          },
        },
        post: {
          type: "array",
          items: {
            $ref: "#/definitions/Post",
          },
        },
      },
    },
    Post: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        title: {
          type: "string",
        },
      },
    },
  },
  $ref: "#/definitions/Response",
};
