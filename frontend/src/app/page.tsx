import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="p-8">
        <div className="mb-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold">Welcome to Gabbers!</h2>
          <p>Practice real-time conversation and improve your English.</p>
        </div>
      </main>
    </div>
  );
}
