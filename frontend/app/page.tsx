import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to GeoFoundation</h1>
        <p className="text-gray-600 mb-8">
          Your solution for global incident tracking and supply chain insights.
        </p>
        <Link href="/dashboard" className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all">
          Login 
        </Link>
      </div>
    </div>
  );
}
