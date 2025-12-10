import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file1 = formData.get("file1") as File;
  const file2 = formData.get("file2") as File;

  if (!file1 || !file2) {
    return NextResponse.json({ result: "Both files are required." }, { status: 400 });
  }

  const text1 = await file1.text();
  const text2 = await file2.text();

  const result =
    text1 === text2 ? "Files are IDENTICAL" : "Files are DIFFERENT";

  return NextResponse.json({ result });
}
