import { readFile } from "node:fs/promises";
import path from "node:path";

const gicAccessCodes = ["culpeper26", "bathbt2026"];

const downloadFiles = {
  "full-install": {
    filename: "GIC_2_0_RC3_Portable_Full_Install.zip",
    contentType: "application/zip",
  },
  update: {
    filename: "GIC_2_0_RC3_Update_Existing_Schools.zip",
    contentType: "application/zip",
  },
  "user-guide": {
    filename: "Graduation Intelligence Center 2.0 Illustrated User Guide.pdf",
    contentType: "application/pdf",
  },
  "upload-cheat-sheet": {
    filename: "GIC School Upload Cheat Sheet.docx",
    contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
  const fileKey = clean(payload.file, 40);
  const fileInfo = downloadFiles[fileKey];

  if (!gicAccessCodes.includes(code)) {
    return response.status(403).json({
      ok: false,
      message: "That code did not work. Please check the school update code and try again.",
    });
  }

  if (!fileInfo) {
    return response.status(400).json({ ok: false, message: "Requested file is not available." });
  }

  try {
    const filePath = path.join(process.cwd(), "api", "gic-files", fileInfo.filename);
    const fileBuffer = await readFile(filePath);

    response.setHeader("Content-Type", fileInfo.contentType);
    response.setHeader("Content-Disposition", `attachment; filename="${fileInfo.filename}"`);
    response.setHeader("Cache-Control", "private, no-store");
    return response.status(200).send(fileBuffer);
  } catch {
    return response.status(500).json({
      ok: false,
      message: "The update file could not be prepared. Please contact Better Together Leadership.",
    });
  }
}
