import type { InvestigationReport } from "@/types";

function formatConfidence(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${Math.round(Math.max(0, Math.min(100, pct)))}%`;
}

function sanitizeFilename(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80) || "investigation-report";
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function pdfEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function wrapLines(text: string, maxLen = 92): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split(/\n+/)) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > maxLen && current) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function buildPdfContent(report: InvestigationReport): string {
  const blocks: string[] = [
    "LogIQ Investigation Report",
    `Investigation ID: ${report.investigationId}`,
    `Generated: ${report.generatedAt}`,
    "",
    "Executive Summary",
    report.executiveSummary,
    "",
    "Timeline Summary",
    report.timelineSummary,
    "",
    "Root Cause",
    report.rootCause,
    "",
    `Confidence: ${formatConfidence(report.confidence)}`,
    report.confidenceNote ? `Note: ${report.confidenceNote}` : "",
    "",
    "Similar Incidents",
    ...report.similarIncidents.map(
      (item) => `- ${item.title} (${item.service}) · ${item.overlap}`
    ),
    "",
    "Feedback History",
    ...report.feedbackHistory.map(
      (entry) =>
        `- ${entry.action} @ ${entry.submittedAt}${entry.comment ? `: ${entry.comment}` : ""}`
    ),
    "",
    "Multi-Agent Findings",
    ...report.multiAgentFindings.map(
      (row) => `- ${row.agent}: ${row.summary} (${formatConfidence(row.confidence)})`
    ),
    "",
    "Runbooks",
    ...report.runbooks.map((book) => `- ${book.id} · ${book.title}: ${book.summary}`),
    "",
    "Recommended Actions",
    ...report.recommendedActions.map((action) => `- ${action}`),
  ];

  return blocks.flatMap((block) => wrapLines(block)).filter((line, index, arr) => {
    return line.length > 0 || (index > 0 && arr[index - 1]?.length > 0);
  }).join("\n");
}

function buildPdfBlob(text: string): Blob {
  const lines = text.split("\n");
  const fontSize = 10;
  const leading = 14;
  const startX = 48;
  const startY = 760;
  const commands: string[] = ["BT", `/F1 ${fontSize} Tf`];

  lines.forEach((line, index) => {
    const y = startY - index * leading;
    if (y < 48) return;
    if (index === 0) {
      commands.push(`${startX} ${y} Td`);
    } else {
      commands.push(`0 ${-leading} Td`);
    }
    commands.push(`(${pdfEscape(line || " ")}) Tj`);
  });
  commands.push("ET");

  const stream = commands.join("\n");
  const streamLength = new TextEncoder().encode(stream).length;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (const object of objects) {
    offsets.push(body.length);
    body += object;
  }

  const xrefOffset = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  body += `startxref\n${xrefOffset}\n%%EOF`;

  return new Blob([body], { type: "application/pdf" });
}

export function buildInvestigationReportMarkdown(report: InvestigationReport): string {
  const sections = [
    `# LogIQ Investigation Report`,
    ``,
    `**Investigation ID:** ${report.investigationId}`,
    `**Generated:** ${report.generatedAt}`,
    ``,
    `## Executive Summary`,
    report.executiveSummary,
    ``,
    `## Timeline Summary`,
    report.timelineSummary,
    ``,
    `## Root Cause`,
    report.rootCause,
    ``,
    `## Confidence`,
    `${formatConfidence(report.confidence)}`,
    report.confidenceNote ? `> ${report.confidenceNote}` : "",
    ``,
    `## Similar Incidents`,
    ...report.similarIncidents.map(
      (item) =>
        `- **${item.title}** (${item.service}) — ${item.overlap}`
    ),
    ``,
    `## Feedback History`,
    ...report.feedbackHistory.map((entry) => {
      const who = entry.submittedBy ? ` by ${entry.submittedBy}` : "";
      const note = entry.comment ? ` — ${entry.comment}` : "";
      return `- **${entry.action}**${who} @ ${entry.submittedAt}${note}`;
    }),
    ``,
    `## Multi-Agent Findings`,
    ...report.multiAgentFindings.map(
      (row) => `- **${row.agent}** (${formatConfidence(row.confidence)}): ${row.summary}`
    ),
    ``,
    `## Runbooks`,
    ...report.runbooks.map((book) => `- **${book.id}** · ${book.title}: ${book.summary}`),
    ``,
    `## Recommended Actions`,
    ...report.recommendedActions.map((action) => `- ${action}`),
    ``,
  ];

  return sections.filter((line) => line !== undefined).join("\n");
}

export function downloadInvestigationReportMarkdown(report: InvestigationReport): void {
  const markdown = buildInvestigationReportMarkdown(report);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `${sanitizeFilename(report.investigationId)}-report.md`);
}

export function downloadInvestigationReportPdf(report: InvestigationReport): void {
  const pdfText = buildPdfContent(report);
  const blob = buildPdfBlob(pdfText);
  downloadBlob(blob, `${sanitizeFilename(report.investigationId)}-report.pdf`);
}
