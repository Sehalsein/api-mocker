"use client";

import { updateCodeSchema } from "@/app/(app)/e/[roomId]/[requestId]/actions";
import { Button } from "@/src/components/ui/button";
import { useSchema } from "@/src/context/SchemaProvider";
import { appSchemaToTypes } from "@/src/utils/parser/app-schema-to-typescript-type";
import EditorRoot, {
  Monaco,
  EditorProps as MonacoEditorProps,
} from "@monaco-editor/react";
import { Save } from "lucide-react";
import { memo, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type Editor = {
  getValue: () => string;
  setValue: (value: string) => void;
  getModel: () => unknown;
  getAction: (action: string) => unknown;
};

type CodeEditorProps = {
  roomId: string;
  requestId: string;
};

type EditorComponentProps = {
  editorRef: React.RefObject<Editor | null>;
  defaultValue: string;
};

type HeaderProps = {
  roomId: string;
  requestId: string;
  editorRef: React.RefObject<Editor | null>;
};

type SaveButtonProps = {
  onClick: () => void;
  disabled: boolean;
};

const LANGUAGES = {
  TYPESCRIPT: "typescript",
  JSON: "json",
} as const;

const HELPER_COMMENTS = {
  [LANGUAGES.TYPESCRIPT]: `/**
 * default export is considered as the root type
 *
 * type Response = {
 *   id: string;
 *   name: string;
 *   post: Post[];
 * }
 *
 * type Post = {
 *   id: string;
 *   title: string;
 * }
 * 
 * export default Response; // <-- root type
 * 
 */`,
  [LANGUAGES.JSON]: `{
  // Your JSON schema here
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "posts": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" }
        }
      }
    }
  }
}`,
};

// Editor configuration
const editorOptions: MonacoEditorProps["options"] = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: "on",
};

export default function CodeEditor({ roomId, requestId }: CodeEditorProps) {
  const { schema } = useSchema();
  const editorRef = useRef<Editor | null>(null);
  const code = appSchemaToTypes(schema);

  return (
    <div className="flex flex-col gap-4 ">
      <Header editorRef={editorRef} requestId={requestId} roomId={roomId} />
      <Editor editorRef={editorRef} defaultValue={code} />
    </div>
  );
}

const Editor = memo(function Editor({
  editorRef,
  defaultValue,
}: EditorComponentProps) {
  const handleEditorDidMount = useCallback((editor: Editor, monaco: Monaco) => {
    editorRef.current = editor;

    // Configure Monaco editor
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    (
      editor.getAction("editor.action.formatDocument") as {
        run: () => void;
      }
    ).run();
  }, []);

  return (
    <EditorRoot
      height="70vh"
      theme="vs-dark"
      defaultLanguage={LANGUAGES.TYPESCRIPT}
      defaultValue={`${HELPER_COMMENTS[LANGUAGES.TYPESCRIPT]}\n${defaultValue}`}
      onMount={handleEditorDidMount}
      options={editorOptions}
    />
  );
});

const Header = memo(function Header({
  roomId,
  requestId,
  editorRef,
}: HeaderProps) {
  const [loading, setLoading] = useState(false);

  const handleSave = useCallback(async () => {
    if (!editorRef.current) return;

    const value = editorRef.current.getValue();
    setLoading(true);

    toast.promise(
      updateCodeSchema(roomId, requestId, value, LANGUAGES.TYPESCRIPT)
        .then(() => {
          console.log("Schema saved");
        })
        .catch((error: Error) => {
          console.error("Failed to save schema:", error);
          throw error; // Re-throw to trigger toast error
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
  }, [editorRef, requestId, roomId]);

  return (
    <div className="flex items-center justify-end space-x-1.5">
      <SaveButton onClick={handleSave} disabled={loading} />
    </div>
  );
});

const SaveButton = memo(function SaveButton({
  onClick,
  disabled,
}: SaveButtonProps) {
  return (
    <Button size="sm" variant="default" onClick={onClick} disabled={disabled}>
      <Save size={16} className="mr-2" />
      Save
    </Button>
  );
});
