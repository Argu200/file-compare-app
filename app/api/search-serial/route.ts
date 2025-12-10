import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const serial = formData.get("serial") as string;

  if (!serial) {
    return NextResponse.json({ result: "Please provide a serial number." });
  }

  // Collect all uploaded files
  const files: File[] = [];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) files.push(value);
  }

  if (files.length === 0) {
    return NextResponse.json({ result: "Please upload at least one file." });
  }

  let found = false;
  let matchedFiles: string[] = [];

  for (const file of files) {
    const text = await file.text();
    if (text.includes(serial)) {
      found = true;
      matchedFiles.push(file.name);
    }
  }

  if (found) {
    return NextResponse.json({
      result: `Serial number "${serial}" found in file(s): ${matchedFiles.join(", ")}`,
    });
  } else {
    return NextResponse.json({
      result: `Serial number "${serial}" not found in any uploaded files.`,
    });
  }
}
