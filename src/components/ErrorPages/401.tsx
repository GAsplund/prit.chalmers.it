export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
      <p className="text-lg text-gray-600">
        Du måste vara inloggad för att se den här sidan.
      </p>
    </div>
  );
}
