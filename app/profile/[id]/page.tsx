export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <p className="text-blue-500">Profile: {id}</p>;
}
