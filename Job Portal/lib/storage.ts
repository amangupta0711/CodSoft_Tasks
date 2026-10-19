import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORAGE_DIR =
  process.env.RESUME_STORAGE_DIR || path.join(process.cwd(), "storage", "resumes");

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_DIR)) {
  try {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create storage directory:", err);
  }
}

export interface UploadedFileResult {
  storedFileName: string;
  originalFileName: string;
  size: number;
  mimeType: string;
}

export class ResumeStorageService {
  private static allowedMimeTypes = [
    "application/pdf",
    "application/x-pdf",
    "application/acrobat",
    "applications/vnd.pdf",
    "text/pdf",
  ];

  /**
   * Validates and saves an uploaded PDF resume buffer
   */
  public static async saveResume(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadedFileResult> {
    // 1. Validate File Size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (fileBuffer.length > MAX_SIZE) {
      throw new Error("File size exceeds 5MB limit. Please upload a smaller PDF resume.");
    }

    // 2. Validate Extension & MIME
    const extension = path.extname(originalName).toLowerCase();
    if (extension !== ".pdf") {
      throw new Error("Invalid file type. Only PDF resumes are accepted.");
    }

    // 3. Verify PDF Header Magic Bytes (%PDF-)
    const header = fileBuffer.slice(0, 5).toString("utf-8");
    if (!header.startsWith("%PDF-")) {
      throw new Error("Invalid PDF file structure. The uploaded document is not a valid PDF.");
    }

    // 4. Generate Safe UUID-based filename
    const sanitizedOriginal = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const storedFileName = `${uniqueId}-${sanitizedOriginal}`;
    const destinationPath = path.join(STORAGE_DIR, storedFileName);

    // 5. Write to secure storage
    await fs.promises.writeFile(destinationPath, fileBuffer);

    return {
      storedFileName,
      originalFileName: sanitizedOriginal,
      size: fileBuffer.length,
      mimeType: "application/pdf",
    };
  }

  /**
   * Retrieves a resume stream/buffer with path traversal prevention
   */
  public static async getResume(storedFileName: string): Promise<{ buffer: Buffer; exists: boolean }> {
    // Prevent path traversal
    const safeBaseName = path.basename(storedFileName);
    const fullPath = path.join(STORAGE_DIR, safeBaseName);

    if (!fs.existsSync(fullPath)) {
      return { buffer: Buffer.from([]), exists: false };
    }

    const buffer = await fs.promises.readFile(fullPath);
    return { buffer, exists: true };
  }

  /**
   * Deletes a previous resume file if replaced
   */
  public static async deleteResume(storedFileName: string): Promise<boolean> {
    try {
      const safeBaseName = path.basename(storedFileName);
      const fullPath = path.join(STORAGE_DIR, safeBaseName);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
