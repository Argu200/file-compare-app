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

  // Upload handlers
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

  // Parse CSV and display serial numbers
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

      // Extract Fixture serial numbers starting with AD15
      const fixtureColumn: string[] = fixtureData.data
        .map((row) => String(row["Serial #"] ?? "").trim())
        .filter((s) => s.length > 0 && s.startsWith("AD15"));

      // Extract Machine serial numbers
      const machineColumn: string[] = machineData.data
        .map((row) => String(row["Serial_Number"] ?? "").trim())
        .filter((s) => s.length > 0);

      setFixtureSerials(fixtureColumn);
      setMachineSerials(machineColumn);
      setError("");
    } catch (e) {
      console.error(e);
      setError("Error parsing CSV files. Check column names and file format.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">CSV Column Viewer</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl space-y-4">
        {/* Fixture Data Upload */}
        <div>
          <h2 className="font-semibold mb-1">Fixture Data (Serial # column, starts with AD15):</h2>
          <FileUploader singleFile onUpload={handleFixtureUpload} />
          {fixtureFile && <p className="text-gray-600 mt-1">{fixtureFile.name}</p>}
        </div>

        {/* Machine Data Upload */}
        <div>
          <h2 className="font-semibold mb-1">Machine Data (Serial_Number column):</h2>
          <FileUploader singleFile onUpload={handleMachineUpload} />
          {machineFile && <p className="text-gray-600 mt-1">{machineFile.name}</p>}
        </div>

        {/* Show Columns Button */}
        <button
          onClick={handleShowColumns}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Show Columns
        </button>

        {/* Error Message */}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* Fixture Serial Numbers */}
        {fixtureSerials.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Fixture Serial # Column (AD15 only)</h2>
            <div className="max-h-64 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200">
              <ul className="list-disc list-inside">
                {fixtureSerials.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Machine Serial Numbers */}
        {machineSerials.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Machine Serial_Number Column</h2>
            <div className="max-h-64 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200">
              <ul className="list-disc list-inside">
                {machineSerials.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
