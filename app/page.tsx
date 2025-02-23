import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export default function Page() {
  const id = nanoid();
  redirect(`/e/${id}`);
}
