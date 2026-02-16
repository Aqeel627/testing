// lib/cryptoService.ts
const SECRET_PASS =
  "9f2d3b7c4a6e8f0b-1c2d3e4f5a6b7c8d-9e0f1a2b3c4d5e6f7-a8b9c0d1e2f3a4";

// Optional: second password (you had PASS in original)
const PASS = SECRET_PASS;

const enc = (str: string) => new TextEncoder().encode(str);
const dec = (buf: ArrayBuffer) => new TextDecoder().decode(buf);

const b64 = (a: ArrayBuffer | Uint8Array) =>
  Buffer.from(a instanceof Uint8Array ? a : new Uint8Array(a)).toString(
    "base64"
  );

const ub64 = (s: string) => new Uint8Array(Buffer.from(s, "base64"));

const subtle = () => {
  if (typeof window !== "undefined") return window.crypto.subtle;
  return globalThis.crypto.subtle;
};

// ---- Key derivation #1 ----
async function getKey() {
  const keyMaterial = await subtle().importKey(
    "raw",
    enc(SECRET_PASS),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return subtle().deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: enc("fixed-salt"),
      iterations: 100000,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// ---- Key derivation #2 (your second implementaton) ----
async function key1() {
  const km = await subtle().importKey("raw", enc(PASS), "PBKDF2", false, [
    "deriveKey",
  ]);

  return subtle().deriveKey(
    {
      name: "PBKDF2",
      salt: enc("x"),
      iterations: 50000,
      hash: "SHA-256",
    },
    km,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export const CryptoService = {
  // --------------------------------------
  async encryptJSON(obj: any) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey();

    const data = enc(JSON.stringify(obj));
    const ct = await subtle().encrypt({ name: "AES-GCM", iv }, key, data);

    return {
      iv: b64(iv),
      payload: b64(ct),
    };
  },

  async decryptJSON(data: { iv: string; payload: string }) {
    const key = await getKey();

    const plain = await subtle().decrypt(
      {
        name: "AES-GCM",
        iv: ub64(data.iv),
      },
      key,
      ub64(data.payload)
    );

    return JSON.parse(dec(plain));
  },

  // --------------------------------------
  async encryptJSON1(obj: any) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await key1();

    const ct = await subtle().encrypt(
      { name: "AES-GCM", iv },
      key,
      enc(JSON.stringify(obj))
    );

    return { iv: b64(iv), payload: b64(ct) };
  },

  async decryptJSON1(data: { iv: string; payload: string }) {
    const key = await key1();

    const pt = await subtle().decrypt(
      { name: "AES-GCM", iv: ub64(data.iv) },
      key,
      ub64(data.payload)
    );

    return JSON.parse(dec(pt));
  },

  // --------------------------------------
  async decryptApiResponse(data: string) {
    const [iv, payload] = data.split("###");
    return this.decryptJSON1({ iv, payload });
  },
};
