import * as React from "react";
import { Globe2, Plus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { Room } from "@/src/types/room";
import Link from "next/link";
import RequestListItem from "./RequestListItem";
import { Button } from "@/src/components/ui/button";

type Props = React.ComponentProps<typeof Sidebar> & {
  roomId: string;
  requests: Room["requests"];
};

export default function RequestSidebar({ requests, ...props }: Props) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/e/${props.roomId}`}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Globe2 className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Mock Api</span>
                  <span className="">v0.0.1</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {Object.entries(requests).map(([requestId, request]) => (
              <SidebarMenuItem key={requestId}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/e/${props.roomId}/${requestId}`}
                    className="font-medium"
                  >
                    <RequestListItem request={request} />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NewRequestButton roomId={props.roomId} />
      </SidebarFooter>
    </Sidebar>
  );
}

function NewRequestButton({ roomId }: { roomId: string }) {
  return (
    <Button asChild>
      <Link href={`/e/${roomId}/new`}>
        <Plus className="h-4 w-4" />
        <span>Add new request</span>
      </Link>
    </Button>
  );
}
