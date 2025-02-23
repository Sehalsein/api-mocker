import CodeEditor from "@/src/view/request/CodeEditor";

export default async function Page(props: {
  params: Promise<{
    roomId: string;
    requestId: string;
  }>;
}) {
  const params = await props.params;

  return <CodeEditor roomId={params.roomId} requestId={params.requestId} />;
}
