
"use client";

import { useState } from "react";
import TopBar from "../components/TopBar";
import FileUploader from "../components/FileUploader";
import DiffView from "../components/DiffView";

export default function Page() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [leftText, setLeftText] = useState<string>("");
  const [rightText, setRightText] = useState<string>("");
  const [isComparing, setIsComparing] = useState(false);

  async function handleCompare() {
    if (!fileA || !fileB) return;
    setIsComparing(true);
    try {
      const [aText, bText] = await Promise.all([fileA.text(), fileB.text()]);
      setLeftText(aText);
      setRightText(bText);
    } finally {
      setIsComparing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-indigo-100">
      <TopBar />

      <main className="mx-auto max-w-7xl px-4 pt-8 pb-20">
        <h1 className="text-2xl font-bold text-gray-900">Compare two files</h1>
        <p className="text-sm text-gray-600 mt-1">
          Supports plain text, CSV, and JSON (line-by-line preview). Drop files below or browse.
        </p>

        <div className="mt-6">
          <FileUploader
            accept=".txt,.csv,.json"
            onChange={({ a, b }) => {
              setFileA(a);
              setFileB(b);
            }}
          />
        </div>

        {/* action bar */}
        <div className="sticky bottom-4 z-40 mx-auto max-w-7xl">
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-card p-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Select two files to run comparison. (Cmd/Ctrl + Enter to compare)
            </p>
            <button
              type="button"
              disabled={!fileA || !fileB || isComparing}
              onClick={handleCompare}
              className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-50 hover:bg-brand-700 transition"
            >
              {isComparing ? "Comparing…" : "Compare"}
            </button>
          </div>
        </div>

        {(leftText || rightText) && (
          <DiffView
            left={leftText}
            right={rightText}
            titleLeft={fileA?.name || "File A"}
            titleRight={fileB?.name || "File B"}
          />
        )}
      </main>
    </div>
  );
}
