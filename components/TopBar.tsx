
"use client";

import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" classNameame="inline-block w-2.5 h-2.5 rounded-full bg-brand-600" />
          File Compare
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => location.reload()}
            className="focus-ring inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            aria-label="Reset page"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </header>
  );
}
