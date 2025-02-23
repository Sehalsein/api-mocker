import { Button } from "@/src/components/ui/button";
import app from "@/src/lib/app";
import RequestListItem from "@/src/view/request/RequestListItem";
import { Ghost, MoveRight, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";

export default async function Page(props: {
  params: Promise<{ roomId: string }>;
}) {
  const params = await props.params;

  const room = await app.room.get(params.roomId);

  if (!room) {
    return <div>Room not found</div>;
  }

  const requests = Object.entries(room.requests);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Requests</h1>
        <Button asChild size="sm">
          <Link href={`/e/${params.roomId}/${nanoid()}`}>
            <Plus className="h-4 w-4" />
            Add new request
          </Link>
        </Button>
      </div>

      {requests.length === 0 && (
        <div className="text-muted-foreground flex items-center justify-center gap-2 flex-col">
          <Ghost className="h-12 w-12" />
          No requests found
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.length > 0 && (
          <Button asChild className="w-full" variant="outline">
            <Link href={`/e/${params.roomId}/${requests[0][0]}`}>
              <RequestListItem request={requests[0][1]} />
              <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
