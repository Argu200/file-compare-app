"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState("");

  async function handleUpload(uploadedFiles: File[]) {
    setFiles(uploadedFiles);
    setResult(""); // reset previous result
  }

  async function handleSearch() {
    if (files.length === 0) {
      setResult("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => formData.append(`file${index}`, file));
    formData.append("serial", serial);

    const res = await fetch("/api/search-serial", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setResult(data.result);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Serial Number Finder</h1>
      <FileUploader onUpload={handleUpload} />
      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter Serial Number"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
        />
        <button style={{ marginLeft: "1rem" }} onClick={handleSearch}>
          Find Serial
        </button>
      </div>
      <h2 style={{ marginTop: "2rem" }}>Result:</h2>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "1rem",
          borderRadius: "8px",
          minHeight: "60px",
        }}
      >
        {result}
      </pre>
    </main>
  );
}
