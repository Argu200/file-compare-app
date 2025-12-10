"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [matchedSerials, setMatchedSerials] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleUpload(uploadedFiles: File[]) {
    if (uploadedFiles.length !== 2) {
      setError("Please upload exactly 2 files.");
      setFiles([]);
      setMatchedSerials([]);
      return;
    }
    setFiles(uploadedFiles);
    setMatchedSerials([]);
    setError("");
  }

  async function handleSearch() {
    if (files.length !== 2) {
      setError("Please upload exactly 2 files before searching.");
      return;
    }

    try {
      const [file1, file2] = files;

      const text1 = await file1.text();
      const text2 = await file2.text();

      // Split lines, trim, filter empty lines
      const serials1 = new Set(
        text1
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      );
      const serials2 = new Set(
        text2
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      );

      const matches = Array.from(serials1).filter((s) => serials2.has(s));

      setMatchedSerials(matches);

      if (matches.length === 0) {
        setError("No matching serial numbers found.");
      } else {
        setError("");
      }
    } catch (e) {
      setError("Error reading files. Make sure they are plain text or CSV.");
      console.error(e);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Serial Number Matcher</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <FileUploader onUpload={handleUpload} />

        <button
          onClick={handleSearch}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Start Search
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {matchedSerials.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              Matched Serial Numbers ({matchedSerials.length})
            </h2>
            <div className="max-h-64 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200">
              <ul className="list-disc list-inside">
                {matchedSerials.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
