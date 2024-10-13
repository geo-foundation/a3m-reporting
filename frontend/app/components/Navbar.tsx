// components/Navbar.tsx
const Navbar = () => (
  <nav className="bg-white shadow-sm p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-gray-900 text-2xl font-semibold">GeoFoundation</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-full py-2 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Happy Customer</span>
        <img
          src="/path-to-profile-picture" 
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </div>
  </nav>
);

export default Navbar;
