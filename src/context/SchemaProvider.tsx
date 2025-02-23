"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { RootSchema, Schema } from "../types/room";

export const SchemaContext = createContext<{
  schema: RootSchema;
  updateSchema: (path: string[], value: Partial<Schema>) => void;
  getSchema: (path: string[]) => Schema | undefined;
} | null>(null);

type Props = Required<
  PropsWithChildren<{
    schema: RootSchema;
  }>
>;

export default function SchemaProvider(props: Props) {
  const [schema] = useState<RootSchema>(props.schema);

  const updateSchema = (path: string[], value: Partial<Schema>) => {
    console.log("NOT IMPLEMENTED", path, value);
  };

  const getSchema = (path: string[]) => {
    console.log("NOT IMPLEMENTED", path);
    return undefined;
  };

  return (
    <SchemaContext.Provider value={{ schema, updateSchema, getSchema }}>
      {props.children}
    </SchemaContext.Provider>
  );
}

export function useSchema() {
  const context = useContext(SchemaContext);
  if (!context) throw new Error("SchemaContext is missing");

  return context;
}
