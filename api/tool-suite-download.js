import { readFile } from "node:fs/promises";
import path from "node:path";

// Add new school-specific access codes here as additional schools join the pilot.
const toolSuiteAccessCodes = ["bathbt2026"];

const downloadFiles = {
  "sol-assessment-data-analyzer": {
    filename: "SOL-Assessment-Data-Analyzer-Windows.zip",
    contentType: "application/zip",
  },
  "powerschool-grade-extractor": {
    filename: "PowerSchool_Grade_Extractor.zip",
    contentType: "application/zip",
  },
  "math-progress-tracker": {
    filename: "Math-Progress-Tracker-FULL-Geometry-Grade-Safety-v4-2026-09-01.zip",
    contentType: "application/zip",
  },
  "science-progress-tracker": {
    filename: "Science-Progress-Tracker-COMPLETE-LATEST-Port-5052-2026-09-13.zip",
    contentType: "application/zip",
  },
  "english-progress-tracker": {
    filename: "English-Progress-Tracker-COMPLETE-LATEST-Port-5053-2026-09-13.zip",
    contentType: "application/zip",
  },
  "school-communication-hub": {
    filename: "school-communication-hub-starter.zip",
    contentType: "application/zip",
  },
  "school-communication-hub-readme": {
    filename: "school-communication-hub-starter-README.md",
    contentType: "text/markdown; charset=utf-8",
  },
};

function clean(value, maxLength = 200) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ ok: false, message: "Method not allowed." });
  }

  let payload;
  try {
    payload =
      typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
  } catch {
    return response.status(400).json({ ok: false, message: "Invalid request body." });
  }

  const code = clean(payload.code).toLowerCase();
  const fileKey = clean(payload.file, 80);
  const fileInfo = downloadFiles[fileKey];

  if (!toolSuiteAccessCodes.includes(code)) {
    return response.status(403).json({
      ok: false,
      message: "That code did not work. Please check the school access code and try again.",
    });
  }

  if (!fileInfo) {
    return response.status(400).json({ ok: false, message: "Requested file is not available." });
  }

  try {
    const filePath = path.join(process.cwd(), "api", "tool-suite-files", fileInfo.filename);
    const fileBuffer = await readFile(filePath);

    response.setHeader("Content-Type", fileInfo.contentType);
    response.setHeader("Content-Disposition", `attachment; filename="${fileInfo.filename}"`);
    response.setHeader("Cache-Control", "private, no-store");
    return response.status(200).send(fileBuffer);
  } catch {
    return response.status(500).json({
      ok: false,
      message: "The download file could not be prepared. Please contact Better Together Leadership.",
    });
  }
}
