// Membuat kode proyek acak yang mudah dibaca (tanpa karakter ambigu 0/O/1/I/L).
// Keunikan dijamin kolom @unique di database; bila bentrok, panggil ulang.
const ALFABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function buatKodeProyek(): string {
  let kode = "";
  for (let i = 0; i < 6; i++) {
    kode += ALFABET[Math.floor(Math.random() * ALFABET.length)];
  }
  return `RD-${kode}`;
}
