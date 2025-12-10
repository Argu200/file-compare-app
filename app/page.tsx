"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [matchedSerials, setMatchedSerials] = useState<string[]>([]);

  // Store uploaded files but don't process yet
  function handleUpload(uploadedFiles: File[]) {
    if (uploadedFiles.length !== 2) {
      alert("Please upload exactly 2 files.");
      return;
    }
    setFiles(uploadedFiles);
    setMatchedSerials([]); // clear previous results
  }

  async function handleSearch() {
    if (files.length !== 2) {
      alert("Please upload exactly 2 files before searching.");
      return;
    }

    const [file1, file2] = files;
    const text1 = await file1.text();
    const text2 = await file2.text();

    // Extract serial numbers (assume one per line)
    const serials1 = new Set(text1.split(/\r?\n/).filter(Boolean));
    const serials2 = new Set(text2.split(/\r?\n/).filter(Boolean));

    // Find matches (intersection)
    const matches = Array.from(serials1).filter((s) => serials2.has(s));

    setMatchedSerials(matches);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Matched Serial Numbers</h1>
      <FileUploader onUpload={handleUpload} />
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSearch}>Start Search</button>
      </div>

      {matchedSerials.length > 0 ? (
        <ul style={{ marginTop: "1rem" }}>
          {matchedSerials.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: "1rem" }}>No matching serial numbers yet.</p>
      )}
    </main>
  );
}
