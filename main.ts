// One-Line Roast: The Gadget You Use Every Day
// make.fun bounty: u-daring-gecko-25-one-line-roast-the-gadget-you-use-3d6aa610
//
// Writes a single roast line (<=200 UTF-8 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt): a roast of a gadget
// the entrant uses every day. Runs on Node 22, no deps.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: the smartwatch as a judgmental coach. It cheers the one
// virtuous thing you did, then silently holds the relapse against you.
const LINE =
  "My smartwatch congratulates me for standing up, then silently judges me for sitting back down.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count a string in Unicode code points, not UTF-16 code units, so an
// emoji or other astral character counts as one character.
function charCount(line: string): number {
  return [...line].length;
}

function resolveOutDir(): string {
  return process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
}

function validateLine(line: string): void {
  // Gate: 1-200 UTF-8 characters, not only whitespace, exactly one line.
  const chars = charCount(line);
  if (chars < 1 || chars > 200) {
    fail(`entry is ${chars} characters, must be 1-200`);
  }
  if (line.trim().length === 0) {
    fail("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    fail("entry must be a single line");
  }
  // UTF-8 round-trip: the text must survive encode/decode unchanged.
  const roundTripped = Buffer.from(line, "utf8").toString("utf8");
  if (roundTripped !== line) {
    fail("entry is not valid UTF-8 text");
  }
}

function writeEntry(line: string): string {
  const outDir = resolveOutDir();
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line, "utf8");
  // Read-back check: what landed on disk must be exactly the line.
  const written = readFileSync(outPath, "utf8");
  if (written !== line) {
    fail("read-back mismatch: entry.txt does not match the line");
  }
  return outPath;
}

function main(): void {
  validateLine(LINE);
  const outPath = writeEntry(LINE);
  const chars = charCount(LINE);
  const bytes = Buffer.from(LINE, "utf8").length;
  console.log(`wrote ${outPath} (${chars} characters, ${bytes} bytes)`);
  console.log(LINE);
}

main();
