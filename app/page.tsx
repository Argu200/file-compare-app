"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [result, setResult] = useState("");

  async function handleUpload(files: File[]) {
    if (files.length < 2) {
      setResult("Please upload 2 files.");
      return;
    }

    const formData = new FormData();
    formData.append("file1", files[0]);
    formData.append("file2", files[1]);

    const response = await fetch("/api/compare", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data.result);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>File Compare App</h1>
      <p>Upload two files to compare their contents.</p>
      <FileUploader onUpload={handleUpload} />
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
