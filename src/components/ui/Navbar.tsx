import Link from "next/link";
import { Calendar } from "lucide-react";


export default function Navbar() {
  return (
    <nav className="bg-white text-black p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/home"> 
            <Calendar className="w-7 h-7 text-blue-500" />
          </Link>
        <Link href="/home" className="text-xl bg-gradient-to-r from-blue-600 to-purple-700 text-transparent bg-clip-text font-semibold tracking-wide">MedAssign</Link>
        </div>
        <div className="space-x-6 text-lg font-medium">
          <Link href="/home" className="text-xl hover:text-gray-500 transition">Home</Link>
          <Link href="/schedule" className="text-xl hover:text-gray-500 transition">Schedule</Link>
          <Link href="/staff" className="text-xl hover:text-gray-500 transition">Staff</Link>
        </div>
      </div>
    </nav>
  );
}
