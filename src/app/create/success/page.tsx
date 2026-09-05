export default async function CreateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string;
    token?: string;
  }>;
}) {
  const { code, token } = await searchParams;

  return (
    <main>
      <h1>Plan created</h1>

      <p>Join code: {code}</p>

      <p>
        Share link:
        {" "}
        {token ? `/j/${token}` : "Unavailable"}
      </p>
    </main>
  );
}