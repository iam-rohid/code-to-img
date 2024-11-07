import { getCurrentSession } from "@/auth/utils";

export default async function Page() {
  const session = await getCurrentSession();

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
