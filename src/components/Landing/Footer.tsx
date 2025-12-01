export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-semibold text-lg text-sky-600">AI Rehab PH</div>
          <p className="mt-2 text-sm text-gray-600">
            Helping Filipinos recover with confidence.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-600">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="mailto:hello@airehab.ph">Contact</a>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} AI Rehab PH — All rights reserved.
      </div>
    </footer>
  );
}
