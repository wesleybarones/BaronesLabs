/** Lê título (TIT2) e letra (USLT) da etiqueta ID3v2.3/2.4 de um MP3. */
export function readId3(buf: ArrayBuffer): { title?: string; lyrics?: string } {
  const b = new Uint8Array(buf);
  if (b.length < 10 || b[0] !== 0x49 || b[1] !== 0x44 || b[2] !== 0x33) return {};
  const v = b[3];
  const synch = (i: number) => ((b[i] & 127) << 21) | ((b[i + 1] & 127) << 14) | ((b[i + 2] & 127) << 7) | (b[i + 3] & 127);
  const plain = (i: number) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  const end = Math.min(b.length, 10 + synch(6));
  const out: { title?: string; lyrics?: string } = {};

  const decode = (e: number, bytes: Uint8Array) => {
    const label = e === 0 ? "latin1" : e === 1 ? "utf-16" : e === 2 ? "utf-16be" : "utf-8";
    return new TextDecoder(label).decode(bytes).normalize("NFC").replace(/\0+$/, "").trim();
  };
  const terminator = (e: number, bytes: Uint8Array, from: number) => {
    if (e === 1 || e === 2) {
      for (let i = from; i + 1 < bytes.length; i += 2) if (bytes[i] === 0 && bytes[i + 1] === 0) return i + 2;
    } else {
      for (let i = from; i < bytes.length; i++) if (bytes[i] === 0) return i + 1;
    }
    return bytes.length;
  };

  for (let i = 10; i + 10 <= end; ) {
    const id = String.fromCharCode(b[i], b[i + 1], b[i + 2], b[i + 3]);
    if (!/^[A-Z0-9]{4}$/.test(id)) break;
    const size = v === 4 ? synch(i + 4) : plain(i + 4);
    const body = b.subarray(i + 10, Math.min(end, i + 10 + size));
    if (id === "TIT2" && body.length > 1) out.title = decode(body[0], body.subarray(1));
    if (id === "USLT" && body.length > 4) {
      const e = body[0];
      const textStart = terminator(e, body, 4); // pula idioma (3 bytes) e descrição
      out.lyrics = decode(e, body.subarray(textStart));
    }
    i += 10 + size;
  }
  if (!out.title) delete out.title;
  if (!out.lyrics) delete out.lyrics;
  return out;
}
