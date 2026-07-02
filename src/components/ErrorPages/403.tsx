export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-headline-xl">403 - Forbidden</h1>
      <p className="text-body-lg text-on-surface-variant">
        Du har inte behörighet att se den här sidan.
      </p>
    </div>
  );
}
