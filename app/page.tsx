"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";
import Papa from "papaparse";

export default function Home() {
  const [fixtureFile, setFixtureFile] = useState<File | null>(null);
  const [machineFile, setMachineFile] = useState<File | null>(null);
  const [fixtureSerials, setFixtureSerials] = useState<string[]>([]);
  const [machineSerials, setMachineSerials] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleFixtureUpload(file: File) {
    setFixtureFile(file);
    setFixtureSerials([]);
    setError("");
  }

  function handleMachineUpload(file: File) {
    setMachineFile(file);
    setMachineSerials([]);
    setError("");
  }

  async function handleShowColumns() {
    if (!fixtureFile || !machineFile) {
      setError("Please upload both Fixture and Machine data files.");
      return;
    }

    try {
      // Parse Fixture CSV
      const fixtureData = await new Promise<Papa.ParseResult<Record<string, string>>>(
        (resolve, reject) => {
          Papa.parse(fixtureFile, {
            header: true,
            skipEmptyLines: true,
            complete: resolve,
            error: reject,
          });
        }
      );

      // Parse Machine CSV
      const machineData = await new Promise<Papa.ParseResult<Record<string, string>>>(
        (resolve, reject) => {
          Papa.parse(machineFile, {
            header: true,
            skipEmptyLines: true,
            complete: resolve,
            error: reject,
          });
        }
      );

      // Auto-detect Fixture Serial column
      const fixtureColName = Object.keys(fixtureData.data[0] || {}).find((col) =>
        col.toLowerCase().includes("serial")
      );
      if (!fixtureColName) throw new Error("No serial number column found in Fixture file.");

      // Auto-detect Machine Serial column
      const machineColName = Object.keys(machineData.data[0] || {}).find((col) =>
        col.toLowerCase().includes("serial")
      );
      if (!machineColName) throw new Error("No serial number column found in Machine file.");

      // Extract serial numbers
      const fixtureColumn: string[] = fixtureData.data
        .map((row) => String(row[fixtureColName] ?? "").trim())
        .filter((s) => s.length > 0);

      const machineColumn: string[] = machineData.data
        .map((row) => String(row[machineColName] ?? "").trim())
        .filter((s) => s.length > 0);

      setFixtureSerials(fixtureColumn);
      setMachineSerials(machineColumn);
      setError("");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error parsing CSV files. Check column names and file format.");
    }
  }

  const maxRows = Math.max(fixtureSerials.length, machineSerials.length);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">CSV Column Viewer</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl space-y-4">
        {/* File Uploaders */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <h2 className="font-semibold mb-1">Fixture Data:</h2>
            <FileUploader singleFile onUpload={handleFixtureUpload} />
            {fixtureFile && <p className="text-gray-600 mt-1">{fixtureFile.name}</p>}
          </div>

          <div className="flex-1">
            <h2 className="font-semibold mb-1">Machine Data:</h2>
            <FileUploader singleFile onUpload={handleMachineUpload} />
            {machineFile && <p className="text-gray-600 mt-1">{machineFile.name}</p>}
          </div>
        </div>

        {/* Show Columns Button */}
        <button
          onClick={handleShowColumns}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Show Columns Side by Side
        </button>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* Table of Serial Numbers */}
        {(fixtureSerials.length > 0 || machineSerials.length > 0) && (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-gray-50">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Fixture Serial #</th>
                  <th className="border px-4 py-2">Machine Serial_Number</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: maxRows }).map((_, idx) => (
                  <tr key={idx} className="even:bg-gray-100">
                    <td className="border px-4 py-2">{fixtureSerials[idx] ?? ""}</td>
                    <td className="border px-4 py-2">{machineSerials[idx] ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
