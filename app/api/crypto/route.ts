import { NextRequest, NextResponse } from "next/server";
import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto";

type CryptoAction = "hashPassword" | "encryptJson" | "decryptJson";

const KEY_LEN = 32;
const GCM_IV_LEN = 12;
const GCM_TAG_LEN = 16;

const b64ToBuf = (value: string) => Buffer.from(value, "base64");
const bufToB64 = (value: Buffer): string => value.toString("base64");

const deriveKey = (password: string, saltB64: string, iterations: number) => {
  return pbkdf2Sync(password, b64ToBuf(saltB64), iterations, KEY_LEN, "sha256");
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body?.action as CryptoAction;

    if (action === "hashPassword") {
      const password = String(body?.password || "");
      const saltB64 = String(body?.saltB64 || "");
      const iterations = Number(body?.iterations || 0);
      if (!password || !saltB64 || !Number.isFinite(iterations) || iterations <= 0) {
        return NextResponse.json({ error: "Invalid hash payload" }, { status: 400 });
      }

      const derived = deriveKey(password, saltB64, iterations);
      return NextResponse.json({ hashB64: bufToB64(derived) });
    }

    if (action === "encryptJson") {
      const password = String(body?.password || "");
      const saltB64 = String(body?.saltB64 || "");
      const iterations = Number(body?.iterations || 0);
      const plainJson = body?.plainJson;
      if (!password || !saltB64 || !Number.isFinite(iterations) || iterations <= 0 || plainJson === undefined) {
        return NextResponse.json({ error: "Invalid encrypt payload" }, { status: 400 });
      }

      const key = deriveKey(password, saltB64, iterations);
      const iv = randomBytes(GCM_IV_LEN);
      const cipher = createCipheriv("aes-256-gcm", key, iv);
      const plain = Buffer.from(JSON.stringify(plainJson), "utf8");
      const ct = Buffer.concat([cipher.update(plain), cipher.final()]);
      const tag = cipher.getAuthTag();

      return NextResponse.json({
        payload: {
          v: 2,
          iv: bufToB64(iv),
          ct: bufToB64(ct),
          tag: bufToB64(tag),
        },
      });
    }

    if (action === "decryptJson") {
      const password = String(body?.password || "");
      const saltB64 = String(body?.saltB64 || "");
      const iterations = Number(body?.iterations || 0);
      const payload = body?.payload;
      if (!password || !saltB64 || !Number.isFinite(iterations) || iterations <= 0 || !payload) {
        return NextResponse.json({ error: "Invalid decrypt payload" }, { status: 400 });
      }

      const key = deriveKey(password, saltB64, iterations);
      const ivB64 = String(payload?.iv || "");
      const ctB64 = String(payload?.ct || "");
      if (!ivB64 || !ctB64) {
        return NextResponse.json({ error: "Invalid encrypted payload" }, { status: 400 });
      }

      const iv = b64ToBuf(ivB64);
      let ct = b64ToBuf(ctB64);
      let tag: Buffer;

      if (payload?.v === 2 && typeof payload?.tag === "string") {
        tag = b64ToBuf(payload.tag);
      } else {
        if (ct.length <= GCM_TAG_LEN) {
          return NextResponse.json({ error: "Ciphertext too short" }, { status: 400 });
        }
        tag = ct.subarray(ct.length - GCM_TAG_LEN);
        ct = ct.subarray(0, ct.length - GCM_TAG_LEN);
      }

      const decipher = createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(tag);
      const plain = Buffer.concat([decipher.update(ct), decipher.final()]);

      return NextResponse.json({ plainJson: JSON.parse(plain.toString("utf8")) });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Crypto operation failed" }, { status: 500 });
  }
}
