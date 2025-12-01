import "../../globals.css";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white/60 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg text-sky-600">
              AI Rehab PH
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/onboard"
                className="px-4 py-2 rounded-md text-sm hover:bg-sky-50"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm shadow-sm hover:opacity-95"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer aria-hidden className="mt-12" />
      </body>
    </html>
  );
}
