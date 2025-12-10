"use client";

import { useState } from "react";
import FileUploader from "../components/FileUploader";
import Papa from "papaparse";

export default function Home() {
  const [fixtureFile, setFixtureFile] = useState<File | null>(null);
  const [machineFile, setMachineFile] = useState<File | null>(null);
  const [matchedSerials, setMatchedSerials] = useState<string[]>([]);
  const [error, setError] = useState("");

  function handleFixtureUpload(file: File) {
    setFixtureFile(file);
    setMatchedSerials([]);
    setError("");
  }

  function handleMachineUpload(file: File) {
    setMachineFile(file);
    setMatchedSerials([]);
    setError("");
  }

  async function handleSearch() {
    if (!fixtureFile || !machineFile) {
      setError("Please upload both Fixture and Machine data files.");
      return;
    }

    try {
      // Parse Fixture file
      const fixtureData = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(fixtureFile, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      // Parse Machine file
      const machineData = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(machineFile, {
          header: true,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        });
      });

      // Extract Serial numbers
      const fixtureSerials = new Set(
        fixtureData.data.map((row: any) => String(row["Serial #"]).trim()).filter(Boolean)
      );

      const machineSerials = new Set(
        machineData.data.map((row: any) => String(row["Serial_Number"]).trim()).filter(Boolean)
      );

      // Find intersection
      const matches = Array.from(fixtureSerials).filter((s) => machineSerials.has(s));

      setMatchedSerials(matches);
      if (matches.length === 0) setError("No matching serial numbers found.");
      else setError("");
    } catch (e) {
      console.error(e);
      setError("Error parsing CSV files. Check column names and file format.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Serial Number Matcher</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl space-y-4">
        <div>
          <h2 className="font-semibold mb-1">Fixture Data (Serial # column):</h2>
          <FileUploader singleFile onUpload={handleFixtureUpload} />
          {fixtureFile && <p className="text-gray-600 mt-1">{fixtureFile.name}</p>}
        </div>

        <div>
          <h2 className="font-semibold mb-1">Machine Data (Serial_Number column):</h2>
          <FileUploader singleFile onUpload={handleMachineUpload} />
          {machineFile && <p className="text-gray-600 mt-1">{machineFile.name}</p>}
        </div>

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
