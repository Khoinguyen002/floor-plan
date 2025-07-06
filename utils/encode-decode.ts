export const toBase64url = (input: string) => {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export function fromBase64Url(b64url: string): string {
  // Chuẩn hóa lại về base64
  let base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");

  // Bổ sung padding (=) nếu thiếu
  const pad = 4 - (base64.length % 4);
  if (pad !== 4) base64 += "=".repeat(pad);

  // Decode
  return Buffer.from(base64, "base64").toString("utf8");
}
