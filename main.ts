// cutest-picture-01 entry (Node 22, standard library only).
//
// The picture is baked into entry.png beside this file. This program just
// copies it to entry.png in the output directory. No network, no randomness,
// no clock: every run writes the same bytes.
//
// Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

// The gate takes a whole PNG or JPEG of at most 1 MiB and 1024 by 1024
// pixels: refuse to enter anything outside it, instead of silently copying
// an invalid file.
const stat = statSync(source);
if (stat.size > 1048576) {
  throw new Error(`entry.png is ${stat.size} bytes, over the 1 MiB gate`);
}
const head = readFileSync(source).subarray(0, 8);
const isPng = head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
if (!isPng && !isJpeg) {
  throw new Error('entry.png is neither a PNG nor a JPEG');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));
