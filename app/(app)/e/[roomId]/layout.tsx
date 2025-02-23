import EditorLayout from "@/src/components/layout/Editor/layout";
import { Button } from "@/src/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import app from "@/src/lib/app";
import RequestSidebar from "@/src/view/request/RequestSidebar";
import { Github } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default async function Layout(
  props: PropsWithChildren & {
    params: Promise<{ roomId: string }>;
  }
) {
  const params = await props.params;
  const room = await app.room.get(params.roomId);

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <RequestSidebar requests={room.requests} roomId={params.roomId} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 justify-between">
          <SidebarTrigger className="-ml-1" />
          <div className="gap-2">
            <Button asChild variant="ghost">
              <Link href={`/e/${params.roomId}`}>
                <span className="sr-only">Github</span>
                <Github className="h-6 w-6" />
              </Link>
            </Button>
            {/* <ThemeToggle /> */}
          </div>
        </header>
        <EditorLayout
          className="flex flex-1 flex-col gap-4 p-4"
          roomId={params.roomId}
        >
          {props.children}
        </EditorLayout>
      </SidebarInset>
    </SidebarProvider>
  );
}
