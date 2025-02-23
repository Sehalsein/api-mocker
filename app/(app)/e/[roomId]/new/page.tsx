import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ roomId: string }>;
};

export default async function Page(props: Props) {
  const { roomId } = await props.params;
  redirect(`/e/${roomId}/${nanoid()}`);
}
