import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST_LINE =
  "My washing machine plays a little victory song when it finishes, like it deserves applause for one load.";

function resolveOutDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function charCount(line: string): number {
  return [...line].length;
}

function validateLine(line: string): void {
  const chars = charCount(line);
  if (chars < 1 || chars > 200) {
    throw new Error(`roast line must be 1-200 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast line must be a single line");
  }
  if (line.trim().length === 0) {
    throw new Error("roast line must not be only whitespace");
  }
  const roundTrip = Buffer.from(line, "utf8").toString("utf8");
  if (roundTrip !== line) {
    throw new Error("roast line is not valid UTF-8 text");
  }
}

function verifyWritten(outPath: string, expected: string): void {
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== expected) {
    throw new Error("read-back check failed: entry.txt does not match the roast line");
  }
}

function writeEntry(): void {
  const outDir = resolveOutDir();
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  validateLine(ROAST_LINE);
  writeFileSync(outPath, ROAST_LINE, "utf8");
  verifyWritten(outPath, ROAST_LINE);
}

writeEntry();
