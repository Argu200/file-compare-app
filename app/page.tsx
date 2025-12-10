"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [matchedSerials, setMatchedSerials] = useState<string[]>([]);

  async function handleUpload(uploadedFiles: File[]) {
    if (uploadedFiles.length !== 2) {
      alert("Please upload exactly 2 files.");
      return;
    }

    setFiles(uploadedFiles);

    // Read file contents
    const [file1, file2] = uploadedFiles;
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
