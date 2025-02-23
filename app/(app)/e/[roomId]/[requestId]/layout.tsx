import app from "@/src/lib/app";
import RequestLayout from "@/src/view/request/RequestLayout";
import { PropsWithChildren } from "react";

const DOMAIN = process.env["NEXT_PUBLIC_HOST_DOMAIN"] ?? "localhost:3000";

type Props = PropsWithChildren & {
  params: Promise<{
    roomId: string;
    requestId: string;
  }>;
};

export default async function Layout(props: Props) {
  const params = await props.params;
  const request = await app.request.get(params.roomId, params.requestId);

  let baseUrl = "";

  if (DOMAIN.startsWith("localhost")) {
    baseUrl = `http://${DOMAIN}`;
  } else {
    baseUrl = `https://${DOMAIN}`;
  }

  baseUrl += `/${params.roomId}`;

  return (
    <RequestLayout
      roomId={params.roomId}
      requestId={params.requestId}
      request={request}
      baseUrl={baseUrl}
    >
      {props.children!}
    </RequestLayout>
  );
}
