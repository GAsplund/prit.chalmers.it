export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-headline-xl">401 - Unauthorized</h1>
      <p className="text-body-lg text-on-surface-variant">
        Du måste vara inloggad för att se den här sidan.
      </p>
    </div>
  );
}
