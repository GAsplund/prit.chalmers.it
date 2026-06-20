export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">403 - Forbidden</h1>
      <p className="text-lg text-gray-600">
        Du har inte behörighet att se den här sidan.
      </p>
    </div>
  );
}
