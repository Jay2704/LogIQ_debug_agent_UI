export interface ParsedLogFile {
  fileName: string;
  content: string;
  lines: string[];
}

export const SUPPORTED_LOG_EXTENSIONS = ["log", "txt", "csv"] as const;

export async function parseUploadedLogFile(file: File): Promise<ParsedLogFile> {
  const content = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => reject(new Error("Failed to read file. Please try again."));
    reader.readAsText(file);
  });

  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.length > 0 ? normalized.split("\n") : [];
  return {
    fileName: file.name,
    content: normalized,
    lines,
  };
}
