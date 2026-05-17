import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/reading", label: "Reading" },
];

export default function Navbar() {
  return (
    <header
      style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-main)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-300 mx-auto px-10 h-16 flex items-center justify-between">
        <Link href="/" style={{ color: "var(--text-primary)" }} className="text-lg font-bold tracking-tight">
          ✦ The Path of Stars
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ color: "var(--text-secondary)" }}
              className="text-sm hover:opacity-70 transition-opacity"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/reading"
            style={{ backgroundColor: "var(--text-primary)", color: "var(--bg-main)" }}
            className="text-sm px-5 py-2 rounded-full hover:opacity-80 transition-opacity"
          >
            Get a Reading
          </Link>
        </nav>
      </div>
    </header>
  );
}
