import Link from 'next/link';

const Sidebar = () => (
  <div className="bg-gray-50 text-gray-900 w-64 h-screen p-6 fixed top-0 left-0 shadow-md">
    <ul className="space-y-4">
      <li className="text-lg font-semibold text-blue-500">
        <Link href="/dashboard">Dashboard</Link> {/* Correct absolute link */}
      </li>
      <li className="text-lg">
        <Link href="/geodb">GeoDB</Link> {/* Correct absolute link */}
      </li>
      <li className="text-lg">
        <Link href="/customerdb">CustomerDB</Link>
      </li>
      <li className="text-lg">
        <Link href="/agents">Agents</Link>
      </li>
      <li className="text-lg">
        <Link href="/settings">Settings</Link>
      </li>
      <li className="text-lg">
        <Link href="/account">Account</Link>
      </li>
      <li className="text-lg">
        <Link href="/help">Help</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
