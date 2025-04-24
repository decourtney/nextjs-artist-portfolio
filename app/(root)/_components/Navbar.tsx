import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="relative pb-4 w-full h-[64px] content-end">
      <ul className="flex justify-center gap-12">
        <li>
          <Link
            href="/"
            className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/gallery"
            className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
          >
            Gallery
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-lg font-medium text-[#64748b] hover:text-[#3b82f6] transition-colors"
          >
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
