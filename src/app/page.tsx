export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Task Management API</h1>
      <div className="space-y-4">
        <p>Welcome to the Task Management API.</p>
        <p>
          Visit{" "}
          <a href="/api-docs" className="text-blue-500 hover:underline">
            API Documentation
          </a>{" "}
          to explore the available endpoints.
        </p>
      </div>
    </div>
  );
}
