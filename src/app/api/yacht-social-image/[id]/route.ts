import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { getYachtDetail } from "@/lib/cya";
import { managedYachts } from "@/lib/managed-yachts";
import { collectGallery } from "@/lib/yacht-detail";
import { CYA_YACHT_ID, SOCIAL_IMAGE_HEIGHT, SOCIAL_IMAGE_WIDTH } from "@/lib/yacht-social";

export const runtime = "nodejs";

const maxImageBytes = 10 * 1024 * 1024;
const photoHosts = new Set(["cya.sfo3.cdn.digitaloceanspaces.com", "cya.sfo3.digitaloceanspaces.com"]);

async function fetchPhoto(source: string) {
  const url = new URL(source);
  if (url.protocol !== "https:" || !photoHosts.has(url.host) || url.username || url.password) {
    throw new Error("Unsupported yacht photo URL");
  }
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(6000) });
  if (!response.ok || !response.body || Number(response.headers.get("content-length")) > maxImageBytes) {
    await response.body?.cancel();
    throw new Error("Yacht photo unavailable");
  }
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxImageBytes) {
        await reader.cancel();
        throw new Error("Yacht photo exceeds the size limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, bytes);
}

function localImage(path: string) {
  return readFile(join(process.cwd(), "public", path));
}

function cropPhoto(input: Buffer) {
  return sharp(input, { limitInputPixels: 40_000_000 })
    .rotate()
    .resize(SOCIAL_IMAGE_WIDTH, SOCIAL_IMAGE_HEIGHT, { fit: "cover" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

async function fallbackImage() {
  const logo = await localImage("images/brand/mcc-logo-light.png");
  const resizedLogo = await sharp(logo).resize({ width: 470, height: 300, fit: "inside" }).png().toBuffer();
  return sharp({
    create: { width: SOCIAL_IMAGE_WIDTH, height: SOCIAL_IMAGE_HEIGHT, channels: 3, background: "#061625" },
  }).composite([{ input: resizedLogo, gravity: "center" }]).jpeg({ quality: 85 }).toBuffer();
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const managed = managedYachts.find(({ slug }) => slug === id);
  let source = managed?.heroImage;
  if (!managed) {
    if (!CYA_YACHT_ID.test(id)) return new Response(null, { status: 404 });
    try {
      source = collectGallery(await getYachtDetail(id))[0]?.src;
    } catch {
      return new Response(null, { status: 404 });
    }
  }

  let image: Buffer | undefined;
  if (source) {
    try {
      image = await cropPhoto(await (managed ? localImage(source) : fetchPhoto(source)));
    } catch {
      // Keep the share card readable while the listing photo is unavailable.
    }
  }
  return new Response(new Uint8Array(image ?? await fallbackImage()), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": image ? "public, max-age=3600, s-maxage=86400" : "public, max-age=60, s-maxage=60",
    },
  });
}
