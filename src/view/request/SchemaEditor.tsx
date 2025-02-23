"use client";

import { updateSchema } from "@/app/(app)/e/[roomId]/[requestId]/actions";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useSchema } from "@/src/context/SchemaProvider";
import { cn } from "@/src/lib/utils";
import { Schema } from "@/src/types/room";
import { Plus, Save, Settings2, Trash2 } from "lucide-react";
import { customAlphabet } from "nanoid";
import { useMemo, useCallback, memo, useState } from "react";
import { toast } from "sonner";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz");

const SCHEMA_TYPES = [
  "object",
  "array",
  "string",
  "number",
  "integer",
  "boolean",
  "null",
] as const;

const TYPE_INDICATOR = {
  Array: "[*]",
} as const;

type SchemaItemProps = {
  schema: Schema;
  path: string[];
};

type AttributeInputProps = {
  type: Schema["type"];
  path: string[];
  name: string;
};

type Props = {
  roomId: string;
  requestId: string;
};

type HeaderProps = Omit<Props, "schema">;

const SchemaEditor = ({ roomId, requestId }: Props) => (
  <div className="border border-border border-dotted p-4">
    <Header roomId={roomId} requestId={requestId} />
    <SchemaView />
  </div>
);

export default SchemaEditor;

const SchemaView = memo(function SchemaView() {
  return null;
  // const { schema } = useSchema();
  // return <SchemaItem schema={schema} path={[]} />;
});
SchemaView.displayName = "SchemaView";

function SchemaItem({ schema, path }: SchemaItemProps) {
  const properties = useMemo(() => {
    if (!schema.properties) return null;
    return Object.entries(schema.properties).map(([key, value]) => (
      <SchemaItem key={key} schema={value} path={[...path, key]} />
    ));
  }, [schema.properties, path]);

  const arrayItem = useMemo(() => {
    if (!schema.items) return null;
    return (
      <SchemaItem
        schema={schema.items}
        path={[...path, TYPE_INDICATOR.Array]}
      />
    );
  }, [schema.items, path]);

  return (
    <div className={cn("pl-0", path.length > 0 && "pl-4")}>
      <AttributeInput type={schema.type} path={path} name={schema.key} />
      {properties}
      {arrayItem}
    </div>
  );
}

function AttributeInput({ type, path, name }: AttributeInputProps) {
  const { updateSchema, getSchema } = useSchema();

  const key = useMemo(() => {
    const lastKey = path[path.length - 1];
    return lastKey === TYPE_INDICATOR.Array ? "" : lastKey ?? "";
  }, [path]);

  const handleTypeChange = useCallback(
    (val: Schema["type"]) => {
      const baseUpdate = {
        key,
        type: val,
        properties: undefined,
        items: undefined,
      };

      if (val === "object") {
        updateSchema(path, {
          ...baseUpdate,
          properties: {},
        });
        return;
      }

      if (val === "array") {
        updateSchema(path, {
          ...baseUpdate,
          type: "array",
          items: { key, type: "string" },
        });
        return;
      }

      updateSchema(path, baseUpdate);
    },
    [key, path, updateSchema]
  );

  const handleAddAttribute = useCallback(() => {
    const name = nanoid(4);
    const schema = getSchema(path);

    if (!schema?.properties) return;

    updateSchema(path, {
      key: name,
      type: "object",
      properties: {
        ...schema.properties,
        [name]: { key: name, type: "string" },
      },
    });
  }, [path, getSchema, updateSchema]);

  const handleNameChange = useCallback(
    (val: string) => {
      const parentPath = path.slice(0, -1);
      const schema = getSchema(parentPath);

      if (!schema?.properties) return;

      updateSchema(parentPath, {
        type: "object",
        properties: {
          ...schema.properties,
          [key]: { key: val, type: "string" },
        },
      });
    },
    [path, key, getSchema, updateSchema]
  );

  return (
    <div className="flex items-center space-x-2 justify-end">
      {type !== "object" ? (
        <Input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      ) : (
        <div className="h-9 w-full rounded-md border border-dashed border-input bg-transparent px-3 py-2 font-mono text-xs">
          empty
        </div>
      )}

      {type === "array" && (
        <Input type="number" placeholder="Enter no of items" value={10} />
      )}

      {type === "object" && (
        <Button size="icon" title="Add Attribute" onClick={handleAddAttribute}>
          <Plus className="h-4 w-4" />
        </Button>
      )}

      <Select defaultValue={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[100px] flex-none">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {SCHEMA_TYPES.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="icon" title="Additional config" className="flex-none">
        <Settings2 className="h-4 w-4" />
      </Button>

      <Button size="icon" title="Delete" className="flex-none">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}

const Header = memo(function Header({ roomId, requestId }: HeaderProps) {
  const [loading, setLoading] = useState(false);
  const { schema } = useSchema();

  const handleSave = useCallback(async () => {
    setLoading(true);

    toast.promise(
      updateSchema(roomId, requestId, schema)
        .then(() => {
          console.log("Schema saved");
        })
        .catch((error: Error) => {
          console.error("Failed to save schema:", error);
        })
        .finally(() => {
          setLoading(false);
        }),
      {
        loading: "Saving schema...",
        success: "Schema saved successfully",
        error: "Failed to save schema",
      }
    );
  }, [roomId, requestId, schema]);

  return (
    <div className="flex items-center justify-end mb-4 space-x-1.5 ">
      <SaveButton onClick={handleSave} disabled={loading} />
    </div>
  );
});

const SaveButton = memo(
  ({ onClick, disabled }: { onClick: () => void; disabled: boolean }) => (
    <Button size="sm" variant="default" onClick={onClick} disabled={disabled}>
      <Save size={16} />
      Save
    </Button>
  )
);
SaveButton.displayName = "SaveButton";
