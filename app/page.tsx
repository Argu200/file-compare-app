"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<{ x: string; y: string }[]>([]);

  async function handleUpload(uploadedFiles: File[]) {
    if (uploadedFiles.length !== 2) {
      alert("Please upload exactly 2 files for comparison.");
      return;
    }
    setFiles(uploadedFiles);

    const [file1, file2] = uploadedFiles;
    const text1 = await file1.text();
    const text2 = await file2.text();

    // Extract serial numbers (one per line)
    const serials1 = text1.split(/\r?\n/).filter(Boolean);
    const serials2 = text2.split(/\r?\n/).filter(Boolean);

    // Prepare scatter data (pair by index)
    const scatterData = serials1.map((s, i) => ({
      x: s,
      y: serials2[i] ?? null, // if lengths differ
    }));

    setData(scatterData);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Serial Number Comparison</h1>
      <FileUploader onUpload={handleUpload} />
      {data.length > 0 && (
        <div style={{ width: "100%", height: 400, marginTop: "2rem" }}>
          <ResponsiveContainer>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis dataKey="x" name="File 1 Serial" />
              <YAxis dataKey="y" name="File 2 Serial" />
              <Tooltip />
              <Scatter name="Serials" data={data} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}
